/* ==================================================
   GoTasker API Integration & SPA Logic (Full System)
   ================================================== */
   const API_URL = "http://localhost:8080";
   let jwtToken = localStorage.getItem('gotasker_token');
   let currentTasks = [];
   
   // DOM Elements
   const authSection = document.getElementById('auth-section');
   const dashboardSection = document.getElementById('dashboard-section');
   const loginForm = document.getElementById('login-form');
   const registerForm = document.getElementById('register-form');
   const userDisplayName = document.getElementById('user-display-name');
   const tasksList = document.getElementById('tasks-list');
   const taskModal = document.getElementById('task-modal');
   
   // View Panels
   const viewDashboard = document.getElementById('view-dashboard');
   const viewCalendar = document.getElementById('view-calendar');
   const viewSettings = document.getElementById('view-settings');
   
   // Initialize
   document.addEventListener('DOMContentLoaded', () => {
       if (jwtToken) {
           showDashboard();
           fetchProfile();
           fetchTasks();
       } else {
           showAuth();
       }
   });
   
   /* --- View Routing Logic --- */
   function switchView(viewId, element) {
       // Update Nav
       document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
       element.classList.add('active');

       // Hide all panels
       viewDashboard.classList.remove('active');
       viewDashboard.classList.add('hidden');
       viewCalendar.classList.remove('active');
       viewCalendar.classList.add('hidden');
       viewSettings.classList.remove('active');
       viewSettings.classList.add('hidden');

       // Show requested panel
       if(viewId === 'dashboard') {
           viewDashboard.classList.remove('hidden');
           setTimeout(() => viewDashboard.classList.add('active'), 10);
           fetchTasks();
       } else if (viewId === 'calendar') {
           viewCalendar.classList.remove('hidden');
           setTimeout(() => viewCalendar.classList.add('active'), 10);
           renderCalendar();
       } else if (viewId === 'settings') {
           viewSettings.classList.remove('hidden');
           setTimeout(() => viewSettings.classList.add('active'), 10);
           fetchProfile();
       }
   }

   /* --- Auth Logic --- */
   function switchAuthTab(tab) {
       if (tab === 'login') {
           loginForm.classList.remove('hidden'); loginForm.classList.add('active');
           registerForm.classList.add('hidden'); registerForm.classList.remove('active');
           document.getElementById('tab-login').classList.add('active');
           document.getElementById('tab-register').classList.remove('active');
       } else {
           registerForm.classList.remove('hidden'); registerForm.classList.add('active');
           loginForm.classList.add('hidden'); loginForm.classList.remove('active');
           document.getElementById('tab-register').classList.add('active');
           document.getElementById('tab-login').classList.remove('active');
       }
   }
   
   function showAuth() {
       authSection.classList.remove('hidden');
       setTimeout(() => authSection.classList.add('active'), 10);
       dashboardSection.classList.add('hidden');
   }
   
   function showDashboard() {
       authSection.classList.add('hidden');
       authSection.classList.remove('active');
       dashboardSection.classList.remove('hidden');
   }
   
   function showToast(message, type = 'success') {
       const toast = document.getElementById('toast');
       const msg = document.getElementById('toast-msg');
       toast.className = 'toast'; void toast.offsetWidth; 
       toast.classList.add(type); toast.classList.add('show');
       
       const icon = toast.querySelector('i.toast-icon');
       if(type === 'success') icon.className = 'fas fa-check-circle toast-icon';
       else if(type === 'error') icon.className = 'fas fa-exclamation-circle toast-icon';
       else icon.className = 'fas fa-info-circle toast-icon';
       
       msg.innerText = message;
       setTimeout(() => { toast.classList.remove('show'); }, 2900);
   }
   
   /* --- Modals --- */
   function openTaskModal(taskId = null, title = '', desc = '') {
       document.getElementById('task-id').value = taskId || "";
       document.getElementById('task-title').value = title || "";
       document.getElementById('task-desc').value = desc || "";
       document.getElementById('modal-title').innerText = taskId ? "Görevi Düzenle" : "Yeni Görev Oluştur";
       taskModal.classList.remove('hidden');
       setTimeout(() => taskModal.classList.add('active'), 10);
   }
   
   function closeTaskModal() {
       taskModal.classList.remove('active');
       setTimeout(() => taskModal.classList.add('hidden'), 400);
   }
   
   /* --- API Integration: Auth --- */
   async function handleLogin(e) {
       e.preventDefault();
       const email = document.getElementById('login-email').value;
       const password = document.getElementById('login-password').value;
       try {
           const res = await fetch(`${API_URL}/auth/login`, {
               method: 'POST', headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password })
           });
           const data = await res.json();
           if (res.ok) {
               jwtToken = data.token; localStorage.setItem('gotasker_token', jwtToken);
               showToast("Başarıyla giriş yapıldı!");
               showDashboard(); fetchProfile(); fetchTasks();
           } else { showToast(data.error || "Giriş başarısız oldu", "error"); }
       } catch (err) { showToast("Ağ hatası. Sunucu çalışıyor mu?", "error"); }
   }
   
   async function handleRegister(e) {
       e.preventDefault();
       const username = document.getElementById('reg-name').value;
       const email = document.getElementById('reg-email').value;
       const password = document.getElementById('reg-password').value;
       try {
           const res = await fetch(`${API_URL}/auth/register`, {
               method: 'POST', headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ username, email, password })
           });
           const data = await res.json();
           if (res.ok) {
               showToast("Kayıt başarılı! Lütfen giriş yapın."); switchAuthTab('login');
           } else { showToast(data.error || "Kayıt başarısız", "error"); }
       } catch (err) { showToast("Ağ hatası.", "error"); }
   }
   
   function handleLogout() {
       localStorage.removeItem('gotasker_token'); jwtToken = null;
       showToast("Çıkış yapıldı.", "info"); showAuth();
   }

   /* --- API Integration: Profile/Settings --- */
   async function fetchProfile() {
       try {
           const res = await fetch(`${API_URL}/auth/me`, {
               headers: { 'Authorization': `Bearer ${jwtToken}` }
           });
           if (res.ok) {
               const data = await res.json();
               userDisplayName.innerText = data.username || "Kullanıcı";
               // Populate Settings Form
               document.getElementById('set-username').value = data.username || "";
               document.getElementById('set-email').value = data.email || "";
           }
       } catch (err) { console.error(err); }
   }

   async function handleUpdateProfile(e) {
       e.preventDefault();
       const username = document.getElementById('set-username').value;
       const email = document.getElementById('set-email').value;
       const newPassword = document.getElementById('set-password').value;

       try {
           const res = await fetch(`${API_URL}/auth/update`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
               body: JSON.stringify({ username, email, new_password: newPassword })
           });
           if (res.ok) {
               showToast("Profil güncellendi! 🎉", "success");
               document.getElementById('set-password').value = "";
               fetchProfile(); // Refresh name
           } else {
               const data = await res.json();
               showToast(data.error || "Güncelleme başarısız", "error");
           }
       } catch(err) { showToast("Ağ hatası", "error"); }
   }
   
   /* --- API Integration: Tasks --- */
   async function fetchTasks() {
       try {
           const res = await fetch(`${API_URL}/tasks/`, {
               headers: { 'Authorization': `Bearer ${jwtToken}` }
           });
           if (res.status === 401) { handleLogout(); return; }
           
           const data = await res.json();
           
           // CRITICAL FIX: Direct array instead of data.data
           currentTasks = Array.isArray(data) ? data : [];
           renderTasks(currentTasks);
       } catch (err) { showToast("Görevler yüklenemedi", "error"); }
   }
   
   function renderTasks(tasks) {
       tasksList.innerHTML = '';
       document.getElementById('task-stats').innerText = `${tasks.length} Görev`;

       if (tasks.length === 0) {
           tasksList.innerHTML = `<div style="text-align:center; color: var(--text-muted); padding: 50px 20px;">
               <i class="fas fa-meteor" style="font-size: 48px; margin-bottom: 20px; opacity:0.3; color: var(--primary);"></i>
               <p style="font-size: 16px;">Henüz hiç göreviniz yok.<br>Hadi "Yeni Görev" diyerek başlayalım!</p>
           </div>`;
           return;
       }
   
       tasks.forEach(task => {
           const div = document.createElement('div');
           div.className = 'task-item';
           const titleSafe = task.title.replace(/'/g, "\\'");
           const descSafe = (task.description || "").replace(/'/g, "\\'");
   
           div.innerHTML = `
               <div class="task-info">
                   <div class="task-title">${task.title}</div>
                   <div class="task-desc">${task.description || 'Açıklama yok'}</div>
               </div>
               <div class="task-actions">
                   <button class="btn-icon edit" onclick="openTaskModal(${task.id}, '${titleSafe}', '${descSafe}')" title="Düzenle">
                       <i class="fas fa-pen"></i>
                   </button>
                   <button class="btn-icon delete" onclick="deleteTask(${task.id})" title="Sil">
                       <i class="fas fa-trash"></i>
                   </button>
               </div>
           `;
           tasksList.appendChild(div);
       });
   }
   
   async function handleTaskSubmit(e) {
       e.preventDefault();
       const id = document.getElementById('task-id').value;
       const title = document.getElementById('task-title').value;
       const description = document.getElementById('task-desc').value;
   
       const isEdit = id !== "";
       const method = isEdit ? 'PUT' : 'POST';
       const endpoint = isEdit ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks/`;
   
       try {
           const res = await fetch(endpoint, {
               method: method,
               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
               body: JSON.stringify({ title, description })
           });
           if (res.ok) {
               showToast(isEdit ? "Görev başarıyla güncellendi! 🚀" : "Görev başarıyla eklendi! 🎉");
               closeTaskModal(); fetchTasks(); 
           } else {
               showToast("Görev kaydedilemedi", "error");
           }
       } catch (err) { showToast("Ağ hatası", "error"); }
   }
   
   async function deleteTask(id) {
       if(!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
       try {
           const res = await fetch(`${API_URL}/tasks/${id}`, {
               method: 'DELETE', headers: { 'Authorization': `Bearer ${jwtToken}` }
           });
           if (res.ok) {
               showToast("Görev silindi!", "success"); fetchTasks();
           } else { showToast("Silinemedi", "error"); }
       } catch (err) { showToast("Ağ hatası", "error"); }
   }

   /* --- Calendar Logic --- */
   let currentDate = new Date();
   
   function changeMonth(dir) {
       currentDate.setMonth(currentDate.getMonth() + dir);
       renderCalendar();
   }

   function renderCalendar() {
       const grid = document.querySelector('.calendar-grid');
       const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
       
       document.getElementById('calendar-month-year').innerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
       
       // Clear old days
       const dayEls = grid.querySelectorAll('.calendar-day');
       dayEls.forEach(el => el.remove());

       const year = currentDate.getFullYear();
       const month = currentDate.getMonth();
       const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
       const daysInMonth = new Date(year, month + 1, 0).getDate();
       
       // Shift for Monday start
       let firstDayOffset = firstDay === 0 ? 6 : firstDay - 1;

       for(let i=0; i<firstDayOffset; i++) {
           const empty = document.createElement('div');
           empty.className = 'calendar-day empty';
           grid.appendChild(empty);
       }

       const today = new Date();

       // Create a map of days with tasks
       const daysWithTasks = new Set();
       currentTasks.forEach(t => {
           if(t.created_at) {
               const d = new Date(t.created_at);
               if(d.getFullYear() === year && d.getMonth() === month) {
                   daysWithTasks.add(d.getDate());
               }
           }
       });

       for(let i=1; i<=daysInMonth; i++) {
           const dayDiv = document.createElement('div');
           dayDiv.className = 'calendar-day';
           if(i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
               dayDiv.classList.add('today');
           }
           dayDiv.innerHTML = `<div class="day-number">${i}</div>`;
           
           if(daysWithTasks.has(i)) {
               dayDiv.innerHTML += `<div class="day-task-indicator"></div>`;
           }
           grid.appendChild(dayDiv);
       }
   }
