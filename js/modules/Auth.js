import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Swal from 'sweetalert2';

export class Auth {
    constructor(firebaseApp) {
        this.auth = firebaseApp.auth();
        this.db = firebaseApp.firestore();
        this.currentUser = null;
        this.onAuthStateChangedCallback = null;
    }

    initialize(container) {
        this.container = container;
        this.container.innerHTML = `
            <div class="auth-container">
                <div id="authStatus" class="auth-status"></div>
                <div id="authButtons" class="auth-buttons">
                    <button id="loginBtn" class="btn-primary">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button id="registerBtn" class="btn-secondary">
                        <i class="fas fa-user-plus"></i> Register
                    </button>
                </div>
                <div id="userProfile" class="user-profile" style="display: none;">
                    <div class="profile-header">
                        <img id="userAvatar" class="avatar" src="" alt="Profile">
                        <div class="profile-info">
                            <h3 id="userName">-</h3>
                            <p id="userEmail">-</p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button id="editProfileBtn" class="btn-secondary">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                        <button id="logoutBtn" class="btn-primary">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.setupAuthStateChanged();
    }

    setupEventListeners() {
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginForm());
        document.getElementById('registerBtn')?.addEventListener('click', () => this.showRegisterForm());
        document.getElementById('editProfileBtn')?.addEventListener('click', () => this.showEditProfileForm());
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    setupAuthStateChanged() {
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
            this.updateUI();
            if (this.onAuthStateChangedCallback) {
                this.onAuthStateChangedCallback(user);
            }
        });
    }

    updateUI() {
        const authStatus = document.getElementById('authStatus');
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');

        if (this.currentUser) {
            authStatus.textContent = '';
            authButtons.style.display = 'none';
            userProfile.style.display = 'block';

            this.loadUserProfile();
        } else {
            authStatus.textContent = 'Please log in to access all features';
            authButtons.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }

    async loadUserProfile() {
        try {
            const doc = await this.db.collection('users').doc(this.currentUser.uid).get();
            const userData = doc.data() || {};

            document.getElementById('userName').textContent = userData.displayName || this.currentUser.displayName || 'Anonymous';
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.getElementById('userAvatar').src = userData.photoURL || this.currentUser.photoURL || '/images/default-avatar.png';
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    async showLoginForm() {
        const { value: formData } = await Swal.fire({
            title: 'Login',
            html: `
                <input type="email" id="email" class="swal2-input" placeholder="Email">
                <input type="password" id="password" class="swal2-input" placeholder="Password">
                <div class="auth-options">
                    <a href="#" onclick="forgotPassword()">Forgot Password?</a>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Login',
            preConfirm: () => {
                return {
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                };
            }
        });

        if (formData) {
            try {
                await this.login(formData.email, formData.password);
                await Swal.fire(
                    'Success!',
                    'You have been logged in successfully.',
                    'success'
                );
            } catch (error) {
                console.error('Login error:', error);
                await Swal.fire(
                    'Error',
                    error.message,
                    'error'
                );
            }
        }
    }

    async showRegisterForm() {
        const { value: formData } = await Swal.fire({
            title: 'Register',
            html: `
                <input type="text" id="displayName" class="swal2-input" placeholder="Display Name">
                <input type="email" id="email" class="swal2-input" placeholder="Email">
                <input type="password" id="password" class="swal2-input" placeholder="Password">
                <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirm Password">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Register',
            preConfirm: () => {
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password !== confirmPassword) {
                    Swal.showValidationMessage('Passwords do not match');
                    return false;
                }

                return {
                    displayName: document.getElementById('displayName').value,
                    email: document.getElementById('email').value,
                    password: password
                };
            }
        });

        if (formData) {
            try {
                await this.register(formData.email, formData.password, formData.displayName);
                await Swal.fire(
                    'Success!',
                    'Your account has been created successfully.',
                    'success'
                );
            } catch (error) {
                console.error('Registration error:', error);
                await Swal.fire(
                    'Error',
                    error.message,
                    'error'
                );
            }
        }
    }

    async showEditProfileForm() {
        const { value: formData } = await Swal.fire({
            title: 'Edit Profile',
            html: `
                <input type="text" id="displayName" class="swal2-input" 
                    placeholder="Display Name" value="${this.currentUser.displayName || ''}">
                <input type="file" id="avatar" class="swal2-file" accept="image/*">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            preConfirm: () => {
                return {
                    displayName: document.getElementById('displayName').value,
                    avatar: document.getElementById('avatar').files[0]
                };
            }
        });

        if (formData) {
            try {
                await this.updateProfile(formData);
                await Swal.fire(
                    'Success!',
                    'Your profile has been updated successfully.',
                    'success'
                );
            } catch (error) {
                console.error('Profile update error:', error);
                await Swal.fire(
                    'Error',
                    error.message,
                    'error'
                );
            }
        }
    }

    async login(email, password) {
        try {
            await this.auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(email, password, displayName) {
        try {
            const credential = await this.auth.createUserWithEmailAndPassword(email, password);
            
            await this.db.collection('users').doc(credential.user.uid).set({
                displayName,
                email,
                createdAt: new Date(),
                role: 'student'
            });

            await credential.user.updateProfile({
                displayName
            });
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async updateProfile(profileData) {
        try {
            const updates = {
                displayName: profileData.displayName
            };

            if (profileData.avatar) {
                const storageRef = firebase.storage().ref();
                const avatarRef = storageRef.child(`avatars/${this.currentUser.uid}`);
                await avatarRef.put(profileData.avatar);
                updates.photoURL = await avatarRef.getDownloadURL();
            }

            await this.currentUser.updateProfile(updates);
            await this.db.collection('users').doc(this.currentUser.uid).update({
                displayName: profileData.displayName,
                photoURL: updates.photoURL
            });

            this.loadUserProfile();
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.auth.signOut();
            await Swal.fire(
                'Success!',
                'You have been logged out successfully.',
                'success'
            );
        } catch (error) {
            console.error('Logout error:', error);
            await Swal.fire(
                'Error',
                'There was an error logging out. Please try again.',
                'error'
            );
        }
    }

    async forgotPassword(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            await Swal.fire(
                'Success!',
                'Password reset email has been sent.',
                'success'
            );
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }

    onAuthStateChanged(callback) {
        this.onAuthStateChangedCallback = callback;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async getUserRole() {
        if (!this.currentUser) return null;

        try {
            const doc = await this.db.collection('users').doc(this.currentUser.uid).get();
            return doc.data()?.role || 'student';
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    }
} 