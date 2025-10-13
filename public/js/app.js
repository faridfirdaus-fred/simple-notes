class NotesApp {
    constructor() {
        this.notes = [];
        this.editingId = null;
        this.initializeElements();
        this.bindEvents();
        this.loadNotes();
    }

    initializeElements() {
        this.form = document.getElementById('note-form');
        this.senderInput = document.getElementById('sender');
        this.contentInput = document.getElementById('content');
        this.noteIdInput = document.getElementById('note-id');
        this.submitBtn = document.getElementById('submit-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.formTitle = document.getElementById('form-title');
        this.charCount = document.getElementById('char-count');
        this.notesContainer = document.getElementById('notes-container');
        this.notesCount = document.getElementById('notes-count');
        this.loading = document.getElementById('loading');
        this.emptyState = document.getElementById('empty-state');
        this.toast = document.getElementById('toast');
        
        // Modal elements
        this.modal = document.getElementById('note-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.createNoteBtn = document.getElementById('create-note-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.contentInput.addEventListener('input', () => this.updateCharCount());
        
        // Modal events
        this.createNoteBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', () => this.closeModal());
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    updateCharCount() {
        const count = this.contentInput.value.length;
        this.charCount.textContent = count;
        
        if (count > 1000) {
            this.charCount.classList.add('text-red-500');
        } else {
            this.charCount.classList.remove('text-red-500');
        }
    }

    async loadNotes() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/notes');
            if (!response.ok) throw new Error('Failed to load notes');
            
            this.notes = await response.json();
            this.renderNotes();
        } catch (error) {
            console.error('Error loading notes:', error);
            this.showToast('Gagal memuat catatan', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const sender = this.senderInput.value.trim();
        const content = this.contentInput.value.trim();
        
        if (!sender || !content) {
            this.showToast('Nama pengirim dan isi catatan harus diisi', 'error');
            return;
        }

        if (content.length > 1000) {
            this.showToast('Isi catatan maksimal 1000 karakter', 'error');
            return;
        }

        try {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Menyimpan...';

            if (this.editingId) {
                await this.updateNote(this.editingId, { sender, content });
            } else {
                await this.createNote({ sender, content });
            }
            
            this.resetForm();
            this.closeModal();
            this.loadNotes();
        } catch (error) {
            console.error('Error saving note:', error);
            this.showToast('Gagal menyimpan catatan', 'error');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = this.editingId ? 'Update Catatan' : 'Simpan Catatan';
        }
    }

    async createNote(noteData) {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create note');
        }

        this.showToast('Catatan berhasil ditambahkan', 'success');
        return response.json();
    }

    async updateNote(id, noteData) {
        const response = await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update note');
        }

        this.showToast('Catatan berhasil diperbarui', 'success');
        return response.json();
    }

    async deleteNote(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
            return;
        }

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete note');
            }

            this.showToast('Catatan berhasil dihapus', 'success');
            this.loadNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            this.showToast('Gagal menghapus catatan', 'error');
        }
    }

    editNote(note) {
        this.editingId = note._id;
        this.noteIdInput.value = note._id;
        this.senderInput.value = note.sender;
        this.contentInput.value = note.content;
        this.updateCharCount();
        
        this.formTitle.textContent = 'Edit Catatan';
        this.submitBtn.textContent = 'Update Catatan';
        
        this.openModal();
    }

    openModal() {
        this.modal.classList.remove('hidden');
        this.modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus on first input
        setTimeout(() => {
            this.senderInput.focus();
        }, 100);
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.modalOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
        this.resetForm();
    }

    resetForm() {
        this.editingId = null;
        this.noteIdInput.value = '';
        this.senderInput.value = '';
        this.contentInput.value = '';
        this.updateCharCount();
        
        this.formTitle.textContent = 'Tambah Catatan Baru';
        this.submitBtn.textContent = 'Simpan Catatan';
    }

    renderNotes() {
        this.notesCount.textContent = this.notes.length;
        
        if (this.notes.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.notesContainer.classList.add('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');
        this.notesContainer.classList.remove('hidden');
        
        this.notesContainer.innerHTML = this.notes.map(note => this.createNoteCard(note)).join('');
    }

    createNoteCard(note) {
        const createdAt = new Date(note.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const updatedAt = note.updatedAt !== note.createdAt 
            ? new Date(note.updatedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : null;

        return `
            <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="mb-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <div class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                                <span class="text-white text-sm">👤</span>
                            </div>
                            <h3 class="font-bold text-gray-800 text-lg">
                                ${this.escapeHtml(note.sender)}
                            </h3>
                        </div>
                        <div class="flex gap-2">
                            <button 
                                onclick="app.editNote(${JSON.stringify(note).replace(/"/g, '&quot;')})"
                                class="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-xl transition-all duration-300 hover:scale-110"
                                title="Edit catatan"
                            >
                                ✏️
                            </button>
                            <button 
                                onclick="app.deleteNote('${note._id}')"
                                class="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-xl transition-all duration-300 hover:scale-110"
                                title="Hapus catatan"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-400">
                        <p class="text-gray-700 leading-relaxed font-medium">
                            ${this.escapeHtml(note.content)}
                        </p>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3">
                    <div class="flex items-center gap-1">
                        <span>📅</span>
                        <span class="font-semibold text-gray-600">Dibuat: ${createdAt}</span>
                    </div>
                    ${updatedAt ? `
                        <div class="flex items-center gap-1">
                            <span>🔄</span>
                            <span class="font-semibold text-gray-600">Diperbarui: ${updatedAt}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(show) {
        if (show) {
            this.loading.classList.remove('hidden');
            this.notesContainer.classList.add('hidden');
            this.emptyState.classList.add('hidden');
        } else {
            this.loading.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toastIcon = this.toast.querySelector('#toast-icon');
        const toastMessage = this.toast.querySelector('#toast-message');
        const toastContainer = this.toast.querySelector('div');
        
        // Reset classes
        toastContainer.className = 'bg-white border rounded-2xl shadow-2xl p-4 max-w-sm transform transition-all duration-300';
        
        // Set icon and colors based on type
        if (type === 'success') {
            toastIcon.innerHTML = '<div class="bg-green-500 rounded-full p-2 text-white">✅</div>';
            toastContainer.classList.add('border-green-200', 'bg-green-50');
        } else if (type === 'error') {
            toastIcon.innerHTML = '<div class="bg-red-500 rounded-full p-2 text-white">❌</div>';
            toastContainer.classList.add('border-red-200', 'bg-red-50');
        } else {
            toastIcon.innerHTML = '<div class="bg-blue-500 rounded-full p-2 text-white">ℹ️</div>';
            toastContainer.classList.add('border-blue-200', 'bg-blue-50');
        }
        
        toastMessage.textContent = message;
        toastMessage.className = 'text-sm font-bold text-gray-800';
        
        this.toast.classList.remove('hidden');
        
        // Add entrance animation
        setTimeout(() => {
            toastContainer.classList.add('scale-105');
        }, 50);
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            toastContainer.classList.remove('scale-105');
            toastContainer.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                this.toast.classList.add('hidden');
                toastContainer.classList.remove('scale-95', 'opacity-0');
            }, 300);
        }, 4000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NotesApp();
});