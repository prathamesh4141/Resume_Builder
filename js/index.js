
let formCount = 0;

document.addEventListener("DOMContentLoaded", function () {
    let formContainer = document.getElementById("formContainer");

    let personalDetails = document.createElement("div");
    personalDetails.classList.add("left-section");
    personalDetails.innerHTML = `
        <h3>Personal Details</h3>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Full Name">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Email">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" placeholder="Phone Number">
        <label for="github">GitHub</label>
        <input type="text" id="github" name="github" placeholder="GitHub Profile">
        <label for="linkedin">LinkedIn</label>
        <input type="text" id="linkedin" name="linkedin" placeholder="LinkedIn Profile">
        <label for="summary">Summary</label>
        <textarea id="summary" name="summary" placeholder="Summary" style="width: 100%; height: 80px;"></textarea>
    `;
    formContainer.prepend(personalDetails);
});


function addNewForm() {
    formCount++;
    let formContainer = document.getElementById("formContainer");
    let addButtonContainer = document.getElementById("addButtonContainer");

    let newForm = document.createElement("div");
    newForm.classList.add("left-section");
    newForm.id = `form-${formCount}`;

    newForm.innerHTML = `
        <h3>Add Details</h3>
        <input type="text" id="title-${formCount}" placeholder="Enter Title">
        
        <div class="editor-toolbar">
            <button onclick="formatText('${formCount}', 'bold')"><span class="material-symbols-outlined">format_bold</span></button>
            <button onclick="formatText('${formCount}', 'italic')"><span class="material-symbols-outlined">format_italic</span></button>
            <button onclick="formatText('${formCount}', 'underline')"><span class="material-symbols-outlined">format_underlined</span></button>
            <button onclick="formatText('${formCount}', 'insertOrderedList')"><span class="material-symbols-outlined">format_list_numbered</span></button>
            <button onclick="formatText('${formCount}', 'insertUnorderedList')"><span class="material-symbols-outlined">format_list_bulleted</span></button>
            <button onclick="setAlignment('${formCount}', 'justifyLeft')"><span class="material-symbols-outlined">format_align_left</span></button>
            <button onclick="setAlignment('${formCount}', 'justifyCenter')"><span class="material-symbols-outlined">format_align_center</span></button>
            <button onclick="setAlignment('${formCount}', 'justifyRight')"><span class="material-symbols-outlined">format_align_right</span></button>
            <button onclick="removeAlignment('${formCount}')"><span class="material-symbols-outlined">format_clear</span></button>
        </div>

        <div class="editor" contenteditable="true" id="detail-${formCount}"></div>
        <button class="delete-btn" onclick="deleteForm('${formCount}')">Delete</button>
    `;

    formContainer.appendChild(newForm);
    formContainer.appendChild(addButtonContainer);
    formContainer.scrollTop = formContainer.scrollHeight;
}


function submitAllData() {
    let dataContainer = document.getElementById("dataContainer");
    dataContainer.innerHTML = ""; // Clear previous data

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let github = document.getElementById("github").value.trim();
    let linkedin = document.getElementById("linkedin").value.trim();
    let summary = document.getElementById("summary").value.trim();

    if (!name || !email || !phone || !summary) {
        alert("Please fill out all required personal details (Name, Email, Phone, Summary).");
        return;
    }

    let personalData = document.createElement("div");
    personalData.classList.add("data-item");
    personalData.innerHTML = `
        <h3>${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>GitHub:</strong> <a href="${github}" target="_blank">${github}</a></p>
        <p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>
        <p><strong>Summary:</strong> ${summary}</p>
    `;
    dataContainer.appendChild(personalData);

    for (let i = 1; i <= formCount; i++) {
        let titleField = document.getElementById(`title-${i}`);
        let detailField = document.getElementById(`detail-${i}`);

        if (titleField && detailField) {
            let title = titleField.value.trim();
            let detail = detailField.innerHTML.trim();

            if (title === "" || detail === "") {
                alert(`Please fill out all fields in section ${i}`);
                return;
            }

            let newData = document.createElement("div");
            newData.classList.add("data-item");
            newData.id = `submitted-${i}`; // Assign unique ID for later deletion
            newData.innerHTML = `<h4>${title}</h4><div>${detail}</div>`;
            dataContainer.appendChild(newData);
        }
    }

    alert("All data submitted successfully!");
}


function submitData(id) {
    let title = document.getElementById(`title-${id}`).value.trim();
    let detail = document.getElementById(`detail-${id}`).innerHTML.trim();

    if (title === "" || detail === "") {
        alert("Please fill out both fields.");
        return;
    }

    let dataContainer = document.getElementById("dataContainer");
    let existingItem = document.getElementById(`submitted-${id}`);

    if (existingItem) {
        existingItem.innerHTML = `<h4>${title}</h4><div>${detail}</div>`;
    } else {
        let newData = document.createElement("div");
        newData.classList.add("data-item");
        newData.id = `submitted-${id}`; // Ensure ID matches the left section
        newData.innerHTML = `<h4>${title}</h4><div>${detail}</div>`;

        dataContainer.appendChild(newData);
    }

    alert("Section saved successfully!");
}


function formatText(id, command) {
    document.getElementById(`detail-${id}`).focus();
    document.execCommand(command, false, null);
}

function setAlignment(id, alignment) {
    let editor = document.getElementById(`detail-${id}`);
    editor.focus();
    document.execCommand(alignment, false, null);
}

function removeAlignment(id) {
    let editor = document.getElementById(`detail-${id}`);
    document.execCommand('removeFormat', false, null);
    editor.style.textAlign = "inherit";
}

function deleteForm(id) {
    let form = document.getElementById(`form-${id}`);
    let dataItem = document.getElementById(`submitted-${id}`);
    let addButtonContainer = document.getElementById("addButtonContainer");
    let formContainer = document.getElementById("formContainer");

    if (form) {
        form.remove();
    }

    if (dataItem) {
        dataItem.remove(); // Now correctly deletes right-side preview
    }

    // If no more forms exist, reset formCount
    if (formContainer.children.length === 1) { // Only the add button remains
        formCount = 0;
    }

    // Move the Add button to always be below the last form
    if (formContainer.children.length > 0) {
        formContainer.appendChild(addButtonContainer);
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    let y = 20; // Start position for content
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const maxWidth = pageWidth - margin * 2; // Max width for text wrapping

    // Get content from the preview section
    let dataContainer = document.getElementById("dataContainer");

    if (!dataContainer.innerHTML.trim()) {
        alert("No content available to download!");
        return;
    }

    pdf.setFont("helvetica");

    y = 12;  // Reduced top margin from 20 to 10
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    let name = document.getElementById("name").value.trim();
    pdf.text(name, pageWidth / 2, y, { align: "center" });
    y += 10;  // Reduce spacing after name

    // Personal Details
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");

    let details = [
        { label: "Email:", value: document.getElementById("email").value.trim() },
        { label: "Phone:", value: document.getElementById("phone").value.trim() },
        { label: "GitHub:", value: document.getElementById("github").value.trim() },
        { label: "LinkedIn:", value: document.getElementById("linkedin").value.trim() },
        { label: "Summary:", value: document.getElementById("summary").value.trim() }
    ];

    details.forEach(detail => {
        if (detail.value) {
            pdf.text(detail.label, margin, y);
            pdf.setFont("helvetica", "normal");

            let wrappedText = pdf.splitTextToSize(detail.value, maxWidth - 30);
            wrappedText.forEach(line => {
                justifyText(pdf, line, margin + 30, y, maxWidth - 30);
                y += 5;
            });

            pdf.setFont("helvetica", "bold");
            y += 3; // Extra space
        }
    });

    y += 4; // Extra space before sections

    // Extract and add dynamic sections from preview
    let sections = document.querySelectorAll("#dataContainer .data-item");

    sections.forEach(section => {
        let sectionTitle = section.querySelector("h4");
        let sectionContent = section.querySelector("div");

        if (sectionTitle) {
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(sectionTitle.textContent, margin, y);
            y += 8;
        }

        if (sectionContent) {
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");

            let wrappedContent = pdf.splitTextToSize(sectionContent.innerText, maxWidth);

            wrappedContent.forEach(line => {
                justifyText(pdf, line, margin, y, maxWidth); // **Justify Wrapped Text**
                y += 6;
            });

            y += 5; // Space between sections
        }

        if (y > 270) {  // Move to next page if near the bottom
            pdf.addPage();
            y = 20;
        }
    });

    // Save the file
    pdf.save("Resume.pdf");
}

/**
 * Function to justify text in jsPDF
 */
function justifyText(pdf, text, x, y, width) {
    let words = text.split(" ");
    let spaceCount = words.length - 1;

    if (spaceCount < 1) {
        pdf.text(text, x, y);
        return;
    }

    let textWidth = pdf.getTextWidth(text);
    let extraSpace = width - textWidth;

    if (extraSpace <= 0) {
        pdf.text(text, x, y);
        return;
    }

    let spaceWidth = extraSpace / spaceCount;
    let currentX = x;

    words.forEach((word, index) => {
        pdf.text(word, currentX, y);
        currentX += pdf.getTextWidth(word) + spaceWidth; // Maintain space distribution

        // Add a small gap after each word except the last one
        if (index !== words.length - 1) {
            currentX += pdf.getTextWidth(" ");
        }
    });
}

