// Select all filter elements
const filters = document.querySelectorAll(".filter");

// Function to apply styles based on the selected filter
function applyStyles(selectedFilter) {
    // Remove 'selectedFilter' class from all filters
    filters.forEach((filter) => filter.classList.remove("selectedFilter"));

    // Special case for the '/listings' path
    if (window.location.pathname === "/listings") {
        if (filters.length > 0) {
            filters[0].classList.add("selectedFilter");
        }
        return;
    }

    // Add 'selectedFilter' class to the clicked filter
    const selectedElement = document.querySelector("." + selectedFilter);
    if (selectedElement) {
        selectedElement.classList.add("selectedFilter");
    }
}

// Add click event listener to each filter
filters.forEach((filter) => {
    filter.addEventListener("click", function () {
        const element = this.classList[1];
        console.log(`Filter clicked: ${element}`); // Debug log

        // Store the selected filter in localStorage
        localStorage.setItem("selectedFilter", element);

        // Apply styles
        applyStyles(element);
    });
});

// On page load, check if a filter was previously selected and apply styles
const storedFilter = localStorage.getItem("selectedFilter");
if (storedFilter) {
    console.log(`Applying stored filter: ${storedFilter}`); // Debug log
    applyStyles(storedFilter);
}




