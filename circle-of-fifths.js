 <script>
document.addEventListener("DOMContentLoaded", () => {
  let wheel = document.querySelector("#wheel");
  let center = document.querySelector("#center");
  let notes = Array.from(document.querySelectorAll("#wheel *"));
  const rotatingText = document.querySelector("#rotating-text");
  let currentRot = 0;

  notes.forEach((note) => {
    note.addEventListener("click", function () {
      currentRot = note.getAttribute("data-rot");
      rotatingText.style.transform = "rotate(" + currentRot + "deg)";
      wheel.style.transform = "rotate(" + currentRot + "deg)";
    });
  });

  center.addEventListener("click", function () {
    rotatingText.style.transform = "rotate(0deg)";
    wheel.style.transform = "rotate(0deg)";
  });
});
</script>
