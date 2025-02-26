// Import Firebase instances from firebaseConfig.js
import { auth, db } from "./firebaseConfig.js";
// ✅ Import Firebase instances correctly
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// ✅ Enable persistence
setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Persistence enabled ✅"))
    .catch(error => console.error("Error setting persistence:", error));

// ✅ Handle authentication state changes
onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user);
    if (user) {
        console.log("User UID:", user.uid);
        currentUserUID = user.uid;
        loadUserData(user.uid);
    } else {
        console.warn("No user logged in, redirecting...");
        setTimeout(() => {
            alert("No user logged in. Redirecting to login page.");
            window.location.href = "index.html";
        }, 1000);  // 🟢 Added delay to avoid immediate redirection
    }
});

let currentUserUID = null;

let formCount = 0;
document.addEventListener("DOMContentLoaded", function () {
    setPersistence(auth, browserLocalPersistence)
        .then(() => console.log("Persistence enabled ✅"))
        .catch(error => console.error("Error setting persistence:", error));
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
            <button onclick="formatText('${formCount}', 'bold')">
                <span class="material-symbols-outlined">format_bold</span>
            </button>
            <button onclick="formatText('${formCount}', 'italic')">
                <span class="material-symbols-outlined">format_italic</span>
            </button>
            <button onclick="formatText('${formCount}', 'underline')">
                <span class="material-symbols-outlined">format_underlined</span>
            </button>
            <button onclick="insertList('${formCount}', 'unordered')">
                <span class="material-symbols-outlined">format_list_bulleted</span>
            </button>
            <button onclick="insertList('${formCount}', 'ordered')">
                <span class="material-symbols-outlined">format_list_numbered</span>
            </button>
        </div>

        <div class="editor" contenteditable="true" id="detail-${formCount}"></div>
        <button class="delete-btn" onclick="deleteForm('${formCount}')">Delete</button>
    `;

    formContainer.appendChild(newForm);
    formContainer.appendChild(addButtonContainer);
    formContainer.scrollTop = formContainer.scrollHeight;

    // ✅ Fix: Prevent default behavior of newly added editor-toolbar buttons
    document.querySelectorAll(".editor-toolbar button").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent any default behavior
        });
    });
}


// Ensure function is globally accessible
window.addNewForm = addNewForm;
window.formatText = formatText;
window.insertList = insertList;
function insertList(id, type) {
    let editor = document.getElementById(`detail-${id}`);
    if (!editor) return;
    let command = type === "ordered" ? "insertOrderedList" : "insertUnorderedList";
    document.execCommand(command, false, null);
    editor.focus();
}

// ✅ Ensure function is globally accessible
window.insertList = insertList;



function submitAllData() {
    let name = document.getElementById("name")?.value.trim();
    let email = document.getElementById("email")?.value.trim();
    let phone = document.getElementById("phone")?.value.trim();
    let github = document.getElementById("github")?.value.trim();
    let linkedin = document.getElementById("linkedin")?.value.trim();
    let summary = document.getElementById("summary")?.value.trim();

    if (!name || !email || !phone || !summary) {
        alert("Please fill out all required personal details.");
        return;
    }

    let userRef = ref(db, `users/${currentUserUID}/dashboard`);

    // ✅ Only save sections currently in the UI
    let updatedSections = [];
    document.querySelectorAll(".left-section[id^='form-']").forEach(form => {
        let formId = form.id.split("-")[1];
        let title = document.getElementById(`title-${formId}`)?.value.trim();
        let detail = document.getElementById(`detail-${formId}`)?.innerHTML.trim();

        if (title && detail) {
            updatedSections.push({ id: formId, title, detail });
        }
    });

    let updatedData = { name, email, phone, github, linkedin, summary, sections: updatedSections };

    // ✅ Update Firebase
    update(userRef, updatedData)
        .then(() => {
            alert("Data successfully updated!");
            loadUserData(currentUserUID);
        })
        .catch(error => alert("Error updating details: " + error.message));
}
window.submitAllData = submitAllData;


function loadUserData(userUID) {
    const userRef = ref(db, `users/${userUID}/dashboard`);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();

            // ✅ Populate personal details in the left-side form
            document.getElementById("name").value = data.name || "";
            document.getElementById("email").value = data.email || "";
            document.getElementById("phone").value = data.phone || "";
            document.getElementById("github").value = data.github || "";
            document.getElementById("linkedin").value = data.linkedin || "";
            document.getElementById("summary").value = data.summary || "";

            // ✅ Clear existing sections in both preview and form container
            document.getElementById("dataContainer").innerHTML = "";
            document.querySelectorAll(".left-section[id^='form-']").forEach(form => form.remove());

            // ✅ Populate personal details in the preview section
            let personalPreview = document.createElement("div");
            personalPreview.classList.add("data-item");
            personalPreview.innerHTML = `
                <h3>${data.name || "No Name Provided"}</h3>
                <p><strong>Email:</strong> ${data.email || "N/A"}</p>
                <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
                <p><strong>GitHub:</strong> <a href="${data.github || "#"}" target="_blank">${data.github || "N/A"}</a></p>
                <p><strong>LinkedIn:</strong> <a href="${data.linkedin || "#"}" target="_blank">${data.linkedin || "N/A"}</a></p>
                <p><strong>Summary:</strong> ${data.summary || "N/A"}</p>
                <hr>
            `;
            document.getElementById("dataContainer").appendChild(personalPreview);

            // ✅ Restore sections in both the left-side form and the preview
            if (data.sections && Array.isArray(data.sections)) {
                data.sections.forEach(section => {
                    let formContainer = document.getElementById("formContainer");
                    let addButtonContainer = document.getElementById("addButtonContainer");

                    // ✅ Restore sections in left-side form
                    let newForm = document.createElement("div");
                    newForm.classList.add("left-section");
                    newForm.id = `form-${section.id}`;

                    newForm.innerHTML = `
                        <h3>Add Details</h3>
                        <input type="text" id="title-${section.id}" placeholder="Enter Title" value="${section.title}">
                        
                        <div class="editor-toolbar">
                            <button onclick="formatText('${section.id}', 'bold')" title="Bold">
                                <span class="material-symbols-outlined">format_bold</span>
                            </button>
                            <button onclick="formatText('${section.id}', 'italic')" title="Italic">
                                <span class="material-symbols-outlined">format_italic</span>
                            </button>
                            <button onclick="formatText('${section.id}', 'underline')" title="Underline">
                                <span class="material-symbols-outlined">format_underlined</span>
                            </button>
                            <button onclick="insertList('${section.id}', 'unordered')" title="Unordered List">
                                <span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                            <button onclick="insertList('${section.id}', 'ordered')" title="Ordered List">
                                <span class="material-symbols-outlined">format_list_numbered</span>
                            </button>
                        </div>

                        <div class="editor" contenteditable="true" id="detail-${section.id}">${section.detail}</div>
                        <button class="delete-btn" onclick="deleteForm('${section.id}')">Delete</button>
                    `;

                    formContainer.appendChild(newForm);
                    formContainer.appendChild(addButtonContainer);

                    // ✅ Restore sections in preview
                    let sectionDiv = document.createElement("div");
                    sectionDiv.classList.add("data-item");
                    sectionDiv.innerHTML = `
                        <h4>${section.title}</h4>
                        <div>${section.detail}</div>
                    `;
                    document.getElementById("dataContainer").appendChild(sectionDiv);
                });
            }
        } else {
            console.log("No user data found.");
        }
    }).catch((error) => {
        console.error("Error loading user data: ", error);
    });
}

function deleteForm(id) {
    let userRef = ref(db, `users/${currentUserUID}/dashboard`);

    get(userRef).then(snapshot => {
        if (snapshot.exists()) {
            let existingData = snapshot.val();
            let updatedSections = (existingData.sections || []).filter(section => section.id !== id);

            // ✅ Update Firebase to remove the deleted section
            update(userRef, { sections: updatedSections })
                .then(() => {
                    document.getElementById(`form-${id}`)?.remove(); // ✅ Remove from UI
                    alert("Section removed successfully!");
                })
                .catch(error => alert("Error deleting section: " + error.message));
        } else {
            alert("No data found to delete.");
        }
    }).catch(error => console.error("Error fetching data:", error));
}

window.deleteForm = deleteForm;

function formatText(id, command) {
    let editor = document.getElementById(`detail-${id}`);
    if (!editor) return;
    document.execCommand(command, false, null);
    editor.focus();
}

function setAlignment(id, alignment) {
    let editor = document.getElementById(`detail-${id}`);
    editor.focus();
    document.execCommand(alignment, false, null);
}



async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    let y = 20; // Initial position
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const contentMargin = margin + 30; // Consistent margin for summary & sections
    const rightMargin = 10;
    const maxWidth = pageWidth - contentMargin - rightMargin; // Adjust width

    let dataContainer = document.getElementById("dataContainer");

    if (!dataContainer.innerHTML.trim()) {
        alert("No content available to download!");
        return;
    }

    pdf.setFont("helvetica");

    // ** Add Name as Title (Centered & Bold) **
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    let name = document.getElementById("name").value.trim();
    pdf.text(name, pageWidth / 2, y, { align: "center" });
    y += 10;

    // ** Personal Details Section **
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
            pdf.setFont("helvetica", "bold");
            pdf.text(detail.label, margin, y);
            pdf.setFont("helvetica", "normal");

            y = justifyText(pdf, detail.value, contentMargin, y, maxWidth); // Apply contentMargin for consistency
            y += 4; // Extra space
        }
    });

    y += 3; // Space before sections

    // ** Extract and Style Sections Dynamically **
    let sections = document.querySelectorAll("#dataContainer .data-item");

    sections.forEach(section => {
        let sectionTitle = section.querySelector("h4");
        let sectionContent = section.querySelector("div");

        if (sectionTitle) {
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(sectionTitle.textContent, margin, y);
            pdf.setTextColor(0, 0, 0); // Reset to black
            y += 5;
        }

        if (sectionContent) {
            pdf.setFontSize(12);
            let contentHTML = sectionContent.innerHTML;
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = contentHTML;

            tempDiv.childNodes.forEach(node => {
                if (y > 270) {  // Move to next page if near bottom
                    pdf.addPage();
                    y = 20;
                }

                if (node.nodeType === Node.TEXT_NODE) {
                    // **Regular text (Justified)**
                    pdf.setFont("helvetica", "normal");
                    y = justifyText(pdf, node.textContent, contentMargin, y, maxWidth);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === "B" || node.tagName === "STRONG") {
                        // **Bold text (Justified)**
                        pdf.setFont("helvetica", "bold");
                        y = justifyText(pdf, node.innerText, contentMargin, y, maxWidth);
                    } else if (node.tagName === "I" || node.tagName === "EM") {
                        // **Italic text (Justified)**
                        pdf.setFont("helvetica", "italic");
                        y = justifyText(pdf, node.innerText, contentMargin, y, maxWidth);
                    } else if (node.tagName === "UL" || node.tagName === "OL") {
                        y += 6; // Add gap before list
                        pdf.setFont("helvetica", "normal");

                        node.querySelectorAll("li").forEach((li, index) => {
                            let wrappedContent = pdf.splitTextToSize(li.innerText, maxWidth - 5); // Reduce width for indentation

                            if (node.tagName === "UL") {
                                pdf.text("•", contentMargin, y); // Bullet point
                            } else {
                                let numText = `${index + 1}.`;
                                pdf.text(numText, contentMargin, y); // Numbered list
                            }

                            y = justifyText(pdf, li.innerText, contentMargin + 7, y, maxWidth - 8);
                        });

                        y += 6; // Add gap after list
                    } else if (node.tagName === "BR") {
                        y += 6; // Line break
                    }
                }
            });

            pdf.setFont("helvetica", "normal"); // Reset to normal text
            y += 5; // Space between sections
        }
    });

    // ** Save the File **
    pdf.save("Resume.pdf");
}

window.downloadPDF = downloadPDF; // ✅ Make function globally accessible

function justifyText(pdf, text, x, y, width) {
    let words = text.split(" ");
    let lines = [];
    let line = "";
    let spaceWidth = pdf.getTextWidth(" "); // Normal space width

    words.forEach(word => {
        let testLine = line.length > 0 ? line + " " + word : word;
        if (pdf.getTextWidth(testLine) <= width) {
            line = testLine; // Add word to current line
        } else {
            lines.push(line); // Store full line
            line = word; // Start new line
        }
    });

    if (line.length > 0) {
        lines.push(line); // Push last line
    }

    // **Loop through each line and justify**
    lines.forEach((line, index) => {
        let wordsInLine = line.split(" ");
        let spaceCount = wordsInLine.length - 1;

        if (index === lines.length - 1 || spaceCount === 0) {
            // Last line or single word -> left align
            pdf.text(line, x, y);
        } else {
            // Full-line justification
            let textWidth = pdf.getTextWidth(line);
            let extraSpace = width - textWidth; // Remaining space to distribute
            let spaceIncrease = extraSpace / spaceCount; // Extra space per word

            let currentX = x;

            wordsInLine.forEach((word, wordIndex) => {
                pdf.text(word, currentX, y);
                currentX += pdf.getTextWidth(word) + spaceWidth + spaceIncrease; // Add adjusted space
            });
        }

        y += 6; // Move to next line
    });

    return y; // Return updated y position
}

document.getElementById("logoutBtn").addEventListener("click", async function () {
    try {
        if (!auth.currentUser) {
            alert("No user logged in. Redirecting to login page.");
            window.location.href = "index.html"; // Redirect to login
            return;
        }

        await signOut(auth);
        sessionStorage.clear();
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout Error:", error);
        alert("Logout failed. Please try again.\nError: " + error.message);
    }
});

