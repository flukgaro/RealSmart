<template>
  <div class="fromContainer">
    <div class="flex">
      <div>Name</div>
      <div class="btn-add" @click="showPopupAdd">Add+</div>
    </div>
    <div class="from-table" v-for="(user, index) in users" :key="user.id"> <!-- v-for -->
      <div class="from-flex">
        <div class="name"> {{ index + 1 }}. {{ user.name }}</div>
        <div class="crud-container">
          <div class="crud view-btn" @click="showPopup(user)">View</div>
          <div class="crud" @click="showPopupEdit(user)">Edit</div>
          <div class="crud" @click="deleteUser(user._id)">Delete</div>
        </div>
      </div> <!-- flex 4 box -->
      <!-- ป๊อปอัพ view -->
      <div v-if="isPopupVisible" class="popup-overlay" @click="hidePopup"></div>
      <div v-if="isPopupVisible" class="popup">
        <div class="from-popup">
          <div>Date Create:</div>
          <div>{{ selectedUser.dateCreate }}</div>
          <div class="btn-close" @click="hidePopup">Close</div>
        </div>
      </div>
      <!-- ป๊อปอัพ save -->
      <div v-if="isPopupAddVisible" class="popup-overlay" @click="hidePopupAdd"></div>
      <form @submit.prevent="addUserName()">
        <div v-if="isPopupAddVisible" class="popup">

          <div class="from-popup">
            <div>
              <label for="name">Name:</label>
              <input class="input-box" type="text" id="name" v-model="name" required />
            </div>
            <button :disabled="!isSaveEnabled" class="btn-save" type="submit">Save</button>

          </div>
          <div class="add-flex">
            <div class="box-left" @drop="drop" @dragover="allowDrop">
              <div id="text" v-if="!isTextDragged" draggable="true" @dragstart="drag">
                <input class="input-box" type="text" id="input-text" v-model="text" required />
              </div>
              <div class="dateC" id="dateC" v-if="!isDateDragged" draggable="true" @dragstart="drag">
                {{ formattedDate }}
              </div>
            </div>
            <div class="box-right" id="box-right" @drop="drop" @dragover="allowDrop">
            </div>
          </div>
          
        </div>
      </form>

      <!-- ป๊อปอัพ edit -->
      <div v-if="isPopupEditVisible" class="popup-overlay" @click="hidePopupEdit"></div>
      <form @submit.prevent="updateUser(selectedUser._id)">
        <div v-if="isPopupEditVisible" class="popup">

          <div class="from-popup">
            <div>
              <label for="name">Name:</label>
              <input class="input-box" :placeholder="selectedUser.name" type="text" id="editName"
                v-model="selectedUser.name" required />
            </div>
            <button class="btn-save" type="submit">Save</button>

          </div>
          <div class="add-flex">
            <div class="box-left" @drop="drop" @dragover="allowDrop">
            </div>
            <div class="box-right" id="box-right" @drop="drop" @dragover="allowDrop">
              <div id="text" draggable="true" @dragstart="drag">
                <input class="input-box" type="text" id="text" v-model="text" required
                  :placeholder="selectedUser.text" />
              </div>
              <div class="dateC">
                <label for="editCreateDate">{{ selectedUser.dateCreate }}</label>
              </div>
            </div>

          </div>
          
        </div>
      </form>
    </div>
  </div>


</template>

<style>
.fromContainer {
  width: 500px;
  margin: auto;
}

.flex {
  display: flex;
  justify-content: space-between;
  margin: 5px;
}

.from-flex {
  display: flex;
  justify-content: space-between;
  margin: 5px;
}

.name {
  flex: 1;
}

.dateC {
  height: 38px;
  margin: 10px 0;
  border: 1px solid;
  text-align: center;
  line-height: 38px;
  padding: 2px;
}

.btn-add {
  width: 50px;
  height: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
}

.btn-save {
  width: 50px;
  height: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
}
.btn-close{
  width: 50px;
  height: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
}

.crud-container {
  display: flex;
  gap: 10px;
}

.crud {
  border: 1px solid #000;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #f0f0f0;
  display: inline-block;
  cursor: pointer;
}

.from-popup {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.input-box {
  height: 40px;
  padding: 0;
  margin: 10px 0;
}

.add-flex {
  display: flex;
  width: 100%;
  height: 300px;
  gap: 30px;
}

.box-left,
.box-right {
  flex: 1;
  padding: 10px;
  border: 1px solid;
}

.box-right {
  display: flex;
}

.popup {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  height: 80%;
  max-height: 600px;
  padding: 40px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.popup-overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'

// ตัวแปรเพื่อเก็บ timestamp
const timestamp = ref(Date.now());
const formattedDate = ref('');
const isSaveEnabled = ref(false);
// แปลง timestamp  dd-mm-yyyy
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

let users = ref([])
// ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้จาก API
const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3001/users');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    // แปลงวันที่ของผู้ใช้ทั้งหมด
    users.value = data.map(user => ({
      ...user,
      dateCreate: formatDate(user.dateCreate),
    }));

    console.log("Users fetched successfully:", users.value);
  } catch (err) {
    console.log('Error fetching users:', err);
  }
};
const initializeData = async () => {
  formattedDate.value = formatDate(timestamp.value);
  await fetchUsers();
};
onMounted(async () => {
  formattedDate.value = formatDate(timestamp.value);
 
  initializeData();


})


const name = ref('');
const text = ref('');

const addUserName = async () => {

  try {
    const response = await fetch('http://localhost:3001/users', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ name: name.value, dateCreate: formattedDate.value, text: text.value }),
    });
    const result = await response.json();
    //console.log("result: " + result);
    hidePopupAdd();

  } catch (err) {
    console.log(err);

  }
}

const deleteUser = async (id) => {
  console.log("id: ", id)
  try {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('result:', result);
    users.value = users.value.filter(user => user.id !== id);
    fetchUsers();

  } catch (err) {
    console.log('Error:', err);
  }
};

const updateUser = async (id) => {
  console.log("id: ", id)
  try {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({ text: text.value }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('result:', result);
    // อัปเดตข้อมูลผู้ใช้ใน users
    const updatedUsers = users.value.map(user => {
      if (user.id === id) {
        return { ...user, text: text.value };
      }
      return user;
    });
    users.value = updatedUsers;
    console.log('Updated users:', users.value);
    hidePopupEdit();
    window.location.reload();

  } catch (err) {
    console.log('Error:', err);
  }
}


const isPopupVisible = ref(false)
const isPopupAddVisible = ref(false)
const isPopupEditVisible = ref(false)
const selectedUser = ref({});



function showPopup(user) {
  selectedUser.value = user;
  isPopupVisible.value = true
}

function hidePopup() {
  isPopupVisible.value = false
}

function showPopupAdd() {
  isPopupAddVisible.value = true
}

function hidePopupAdd() {
  isPopupAddVisible.value = false
  isTextDragged.value = false;
  isDateDragged.value = false;
  isSaveEnabled.value = false;
}

function showPopupEdit(user) {
  selectedUser.value = user;
  isPopupEditVisible.value = true
}

function hidePopupEdit() {
  isPopupEditVisible.value = false
}

const isTextDragged = ref(false); // ตัวแปรเพื่อเช็คสถานะการลากของ text
const isDateDragged = ref(false); // ตัวแปรเพื่อเช็คสถานะการลากของ date

//ลาก
const drag = (event) => {
  event.dataTransfer.setData('text/plain', event.target.id);
};

//วาง
const drop = (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(data);

  if (draggedElement) {
    //  element ลากมาจาก box-left 
    if (draggedElement.parentNode.classList.contains('box-left') || !event.target.classList.contains('box-right')) {
      const clone = draggedElement.cloneNode(true);
      clone.setAttribute('draggable', 'true');
      clone.addEventListener('dragstart', drag);

      if (event.target.classList.contains('box-right')) {
        //move left->right
        event.target.appendChild(clone);
        if (data === 'text') {
          isTextDragged.value = true; // ตั้งค่าสถานะการลาก text
        } else if (data === 'dateC') {
          isDateDragged.value = true; // ตั้งค่าสถานะการลาก date
        }
        if (isTextDragged.value && isDateDragged.value) {
          isSaveEnabled.value = true;
        }
      } else if (event.target.id === 'input-text') {
        event.target.parentElement.insertBefore(clone, event.target.nextSibling);
      }
    }
  }
};


const allowDrop = (event) => {
  event.preventDefault();
};
</script>