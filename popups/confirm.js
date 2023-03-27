
function showConfirmPopup() {
      // Show the confirmation popup
      var confirmPopup = document.getElementById("confirm-popup");
      confirmPopup.style.display = "block";

      // Add event listeners to the buttons
      var blueButton = document.getElementById("blue-button");
      var redButton = document.getElementById("red-button");

      blueButton.addEventListener("click", function () {
            // Do something when the blue button is clicked
            console.log("Blue button clicked");
      });

      redButton.addEventListener("click", function () {
            // Do something when the red button is clicked
            console.log("Red button clicked");
      });
}
