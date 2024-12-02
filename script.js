window.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');
    const defaultImage = 'images/default_profile_picture.jpg';
    const themeToggle = document.getElementById('theme-toggle');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
  
    // Initially hide the spinner and error message
  loadingSpinner.style.display = 'none';
  errorMessage.classList.add('none');
  
    // Check if theme preference is stored in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
      themeToggle.checked = savedTheme === 'dark'; // Set the toggle based on saved theme
    }
  
    // Event listener for the theme toggle
    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        localStorage.setItem('theme', 'dark'); // Save the theme preference
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light'); // Save the theme preference
      }
    });
  
    // Show loading spinner while fetching user data
    loadingSpinner.style.display = 'block';
  
    // Fetch user data
    fetch('https://mocki.io/v1/b3754cc5-c341-4459-9fa1-baed8f562f21')
      .then(response => response.json())
      .then(data => {
        const users = data.users;
  
        users.forEach(user => {
          const userCard = document.createElement('div');
          userCard.classList.add('user-card');
  
          // Use default image if profile picture is missing or empty
          const profilePicture = user.profilePicture || defaultImage;

          
  
          // Email validation and truncation logic
          let email = user.email;
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          let emailValidationMessage = '';
  
          if (!emailRegex.test(email)) {
            emailValidationMessage = 'Invalid email format';
            email = 'Invalid email'; // You can change this to something else if you prefer
          } else if (email.length > 30) {
            email = email.slice(0, 30) + '...';
          }
  
          // Truncate bio initially
          const bioMaxLength = 150;
          let shortBio = user.bio.slice(0, bioMaxLength);
          let fullBio = user.bio;
          const isTruncated = fullBio.length > bioMaxLength;
  
          userCard.innerHTML = `
            <div class="image-upload-section">
              <img src="${profilePicture}" alt="${user.name}" id="profile-pic-${user.id}" />
              <input type="file" class="upload-input" id="upload-input-${user.id}" style="display:none" accept="image/*" />
              <button class="upload-btn" id="upload-btn-${user.id}">Upload New Image</button>
              <button class="delete-btn" id="delete-btn-${user.id}">Delete</button>
            </div>
            <h3>
              <span id="user-name-${user.id}">${user.name}</span>
              <button class="edit-btn" id="edit-btn-${user.id}">Edit</button>
            </h3>
            <div class="save-cancel-buttons" id="save-cancel-buttons-${user.id}">
              <button class="save-btn" id="save-btn-${user.id}">Save</button>
              <button class="cancel-btn" id="cancel-btn-${user.id}">Cancel</button>
            </div>
            <p id="bio-${user.id}">${isTruncated ? shortBio + '...' : fullBio}</p>
            ${isTruncated ? `<button id="read-more-${user.id}" class="read-more-btn">Read More</button>` : ''}
            <p><strong>Email:</strong> <span title="${user.email}">${email}</span></p>
            ${emailValidationMessage ? `<p style="color: red;">${emailValidationMessage}</p>` : ''}
            <p><strong>Followers:</strong> <span id="followers-count-${user.id}">${user.followers}</span></p>
            <button class="follow-btn" id="follow-btn-${user.id}">${user.isFollowed ? 'Unfollow' : 'Follow'}</button>
            <button class="delete-profile-btn" id="delete-profile-btn-${user.id}">Delete Profile</button>
          `;
  
          // Handle Follow/Unfollow toggle
          const followBtn = userCard.querySelector(`#follow-btn-${user.id}`);
          const followersCount = userCard.querySelector(`#followers-count-${user.id}`);
  
          followBtn.addEventListener('click', () => {
            const isFollowing = followBtn.textContent === 'Unfollow';
  
            if (isFollowing) {
              // Unfollow logic
              followBtn.textContent = 'Follow';
              followBtn.classList.remove('unfollow');
              followersCount.textContent = parseInt(followersCount.textContent) - 1;
            } else {
              // Follow logic
              followBtn.textContent = 'Unfollow';
              followBtn.classList.add('unfollow');
              followersCount.textContent = parseInt(followersCount.textContent) + 1;
            }
          });
  
          // Handle Edit Name button click
            const editBtn = userCard.querySelector(`#edit-btn-${user.id}`);
            const userName = userCard.querySelector(`#user-name-${user.id}`);
            const saveBtn = userCard.querySelector(`#save-btn-${user.id}`);
            const cancelBtn = userCard.querySelector(`#cancel-btn-${user.id}`);
            const saveCancelButtons = userCard.querySelector(`#save-cancel-buttons-${user.id}`);

            // Store the original name in a data attribute
            userName.setAttribute('data-original-name', userName.textContent);

            editBtn.addEventListener('click', () => {
            // Enable input for editing
            const input = document.createElement('input');
            input.type = 'text';
            input.value = userName.textContent;
            userName.innerHTML = '';
            userName.appendChild(input);

            // Show Save and Cancel buttons
            saveCancelButtons.style.display = 'block';
            editBtn.style.display = 'none';
            });

            // Handle Save button click
            saveBtn.addEventListener('click', () => {
            const newName = userName.querySelector('input').value;
            if (newName.trim() !== '') {
                userName.textContent = newName;
                // Update the data attribute to the new name
                userName.setAttribute('data-original-name', newName);
                saveCancelButtons.style.display = 'none';
                editBtn.style.display = 'inline-block';
            }
            });

            // Handle Cancel button click
            cancelBtn.addEventListener('click', () => {
            // Revert to the last saved name from the data attribute
            userName.textContent = userName.getAttribute('data-original-name');
            saveCancelButtons.style.display = 'none';
            editBtn.style.display = 'inline-block';
            });

  
          // Handle Read More/Read Less functionality
          const readMoreBtn = userCard.querySelector(`#read-more-${user.id}`);
          const bioParagraph = userCard.querySelector(`#bio-${user.id}`);
  
          if (readMoreBtn) {
            readMoreBtn.addEventListener('click', () => {
              if (bioParagraph.textContent === shortBio + '...') {
                bioParagraph.textContent = fullBio;
                readMoreBtn.textContent = 'Read Less';
              } else {
                bioParagraph.textContent = shortBio + '...';
                readMoreBtn.textContent = 'Read More';
              }
            });
          }
  
          // Handle Image Upload
          const uploadBtn = userCard.querySelector(`#upload-btn-${user.id}`);
          const uploadInput = userCard.querySelector(`#upload-input-${user.id}`);
          const profilePic = userCard.querySelector(`#profile-pic-${user.id}`);
  
          uploadBtn.addEventListener('click', () => {
            uploadInput.click();
          });
  
          uploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                profilePic.src = reader.result;
              };
              reader.readAsDataURL(file);
            }
          });
  
          // Handle Delete Image
          const deleteBtn = userCard.querySelector(`#delete-btn-${user.id}`);
          deleteBtn.addEventListener('click', () => {
            profilePic.src = defaultImage;
            uploadInput.value = '';
          });
  
          // Handle the delete profile button click with confirmation
          const deleteProfileBtn = userCard.querySelector(`#delete-profile-btn-${user.id}`);
          deleteProfileBtn.addEventListener('click', () => {
            const confirmation = confirm("Are you sure you want to delete this profile?");
            if (confirmation) {
              userCard.remove(); // Remove the user card from the DOM
            }
          });
  
          userList.appendChild(userCard);
        });
  
        // Hide the loading spinner after data is loaded
        loadingSpinner.style.display = 'none';
      })
      .catch(error => {
        // Hide spinner and display error message
        loadingSpinner.style.display = 'none';
        errorMessage.textContent = 'Failed to load user data'; // Customize the error message
        errorMessage.style.display = 'block'; // Display the error message
      });
  });
  