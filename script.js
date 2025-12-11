function generateDoc() {
    // 1. جلب البيانات من الخانات
    const type = document.getElementById('docType').value;
    const p1 = document.getElementById('partyOne').value;
    const p2 = document.getElementById('partyTwo').value;
    const date = document.getElementById('date').value;
    const resultBox = document.getElementById('resultArea');
    const finalText = document.getElementById('finalText');

    let text = "";

    // 2. التحقق من إدخال البيانات
    if (p1 === "" || p2 === "" || date === "") {
        alert("المرجو ملء جميع الخانات!");
        return;
    }

    // 3. اختيار القالب المناسب
    if (type === "contract") {
        text = `إنه في يوم ${date}،\nتم الاتفاق بين:\nالطرف الأول: السيد/ة ${p1}\nوالطرف الثاني: السيد/ة ${p2}\n\nحيث اتفق الطرفان على أن يقوم الطرف الأول بتقديم خدمات برمجية للطرف الثاني مقابل مبلغ متفق عليه. ويلتزم الطرفان بسرية المعلومات.\n\nتوقيع الطرف الأول: ....................    توقيع الطرف الثاني: ....................`;
    } else if (type === "commitment") {
        text = `أنا الموقع أسفله، السيد/ة ${p1}،\nبكامل قواي العقلية والجسدية، أشهد وألتزم بموجب هذه الوثيقة أنني مدين للسيد/ة ${p2} بمبلغ مالي، وأتعهد بسداده قبل تاريخ ${date}.\n\nوهذا التزام مني بذلك.\n\nالتوقيع:\n....................`;
    }

    // 4. عرض النتيجة
    finalText.innerText = text;
    resultBox.classList.remove("hidden");
}