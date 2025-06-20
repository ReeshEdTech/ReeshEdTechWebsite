console.log("✅ main.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  // Hide all submenus initially
  document.querySelectorAll('.submenu').forEach(menu => {
    menu.style.display = 'none';
  });

  // Restore open submenu on load
  const openId = localStorage.getItem('openSubmenu');
  if (openId) {
    const submenu = document.getElementById('submenu-' + openId);
    if (submenu) submenu.style.display = 'block';
  }
});

// Toggle submenu function
function toggleSubmenu(id) {
  const submenu = document.getElementById('submenu-' + id);
  if (submenu) {
    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
  }
}

// Save open submenu ID
function setOpenSubmenu(id) {
  localStorage.setItem('openSubmenu', id);
}
