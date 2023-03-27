
function showAlertPopup() {
      // Show the alert popup
      var alertPopup = document.getElementById("alert-popup");
      alertPopup.style.display = "block";

      // Hide the alert popup after 5 seconds
      setTimeout(function () {
            alertPopup.style.display = "none";
      }, 5000);
}