// for show.ejs for delete button
document.addEventListener("DOMContentLoaded", () => {
  const confirmBox = document.getElementById("deleteConfirm");
  const overlay = document.getElementById("deleteOverlay");
  const deleteBtn = document.querySelector(".btn-outline-danger"); // your delete button

  if (!confirmBox || !overlay || !deleteBtn) return; // stop if not on this page

  function showConfirm() {
    confirmBox.classList.add("show");
    overlay.classList.add("show");
  }

  function hideConfirm() {
    confirmBox.classList.remove("show");
    overlay.classList.remove("show");
  }

  // Events
  deleteBtn.addEventListener("click", showConfirm);
  overlay.addEventListener("click", hideConfirm);

  // Optional: bind Cancel button too
  const cancelBtn = confirmBox.querySelector(".btn-secondary");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", hideConfirm);
  }
});



// for heart icon in listing page in index.ejs
function toggleFavorite(toggleElement, event) {
    // Stop the click event from propagating to the parent <a> tag
    event.stopPropagation();
    event.preventDefault(); 
    
    // Find the icon element inside the toggle container
    const iconElement = toggleElement.querySelector('.favorite-icon');

    // Toggle the 'is-favorite' class on the *container* to trigger color change via CSS
    toggleElement.classList.toggle('is-favorite');

    // Check the new state of the 'is-favorite' class on the container
    const isNowFavorite = toggleElement.classList.contains('is-favorite');

    // Toggle the icon class based on the container state
    if (isNowFavorite) {
      // If it IS a favorite, remove the outline and add the filled icon (which CSS colors red)
      iconElement.classList.remove('bi-heart');
      iconElement.classList.add('bi-heart-fill');
    } else {
      // If it is NOT a favorite, remove the filled icon and add the outline (which CSS colors dark grey)
      iconElement.classList.remove('bi-heart-fill');
      iconElement.classList.add('bi-heart');
    }

    // Future logic to save favorite state goes here
    // console.log(`Listing ${toggleElement.dataset.listingId} favorite status toggled.`);
  }



  // Bootstrap Custom Validation Script
  (() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  })()



  const stickyBox = document.getElementById("stickyBox");
const mapWrapper = document.querySelector(".map-wrapper");

window.addEventListener("scroll", () => {
  const mapBottom = mapWrapper.getBoundingClientRect().bottom;
  if (mapBottom < 20) {
    stickyBox.style.position = "relative"; // stop sticking
  } else {
    stickyBox.style.position = "sticky";
  }
});


//For flash message

  // Auto-dismiss flash messages after 10 seconds
  setTimeout(() => {
    const alerts = document.querySelectorAll('.flash-message');
    alerts.forEach(alert => {
    const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      bsAlert.close();
    });
  }, 5000); // 5000 ms = 5 seconds




  //for map

  function initMap() {
    const listingLat = <%= listing.latitude || 28.6139 %>; // fallback latitude
    const listingLng = <%= listing.longitude || 77.2090 %>; // fallback longitude

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: listingLat, lng: listingLng },
      zoom: 14,
    });

    const marker = new google.maps.Marker({
      position: { lat: listingLat, lng: listingLng },
      map: map,
      title: "<%= listing.title %>",
    });
  }




