const API_BASE = 'http://localhost:5000/contacts';

// 页面加载时获取联系人列表
document.addEventListener('DOMContentLoaded', loadContacts);

// 加载联系人列表
async function loadContacts() {
    try {
        const response = await fetch(API_BASE);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// 显示联系人列表
function displayContacts(contacts) {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.phone}</td>
            <td>${contact.email || ''}</td>
            <td>
                <button onclick="editContact(${contact.id})">编辑</button>
                <button onclick="deleteContact(${contact.id})">删除</button>
            </td>
        `;
        contactsList.appendChild(row);
    });
}

// 保存联系人（添加或更新）
async function saveContact() {
    const contactId = document.getElementById('contactId').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    const contactData = { name, phone, email };
    
    try {
        if (contactId) {
            // 更新联系人
            await fetch(`${API_BASE}/${contactId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
        } else {
            // 添加联系人
            await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
        }
        
        resetForm();
        loadContacts();
    } catch (error) {
        console.error('Error saving contact:', error);
    }
}

// 编辑联系人
async function editContact(id) {
    try {
        const response = await fetch(API_BASE);
        const contacts = await response.json();
        const contact = contacts.find(c => c.id === id);
        
        if (contact) {
            document.getElementById('contactId').value = contact.id;
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('email').value = contact.email || '';
            document.getElementById('formTitle').textContent = '编辑联系人';
        }
    } catch (error) {
        console.error('Error editing contact:', error);
    }
}

// 删除联系人
async function deleteContact(id) {
    if (confirm('确定要删除这个联系人吗？')) {
        try {
            await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            loadContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    }
}

// 重置表单
function resetForm() {
    document.getElementById('contactId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('formTitle').textContent = '添加联系人';
}
