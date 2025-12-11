// تشغيل الكود بمجرد تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تعيين تاريخ اليوم كافتراضي
    document.getElementById('date').valueAsDate = new Date();
    updateContent(); // تحديث أولي
});

function updateContent() {
    // جلب البيانات
    const type = document.getElementById('docType').value;
    const p1 = document.getElementById('partyOne').value || "..................";
    const id1 = document.getElementById('idOne').value || "..................";
    const p2 = document.getElementById('partyTwo').value || "..................";
    const id2 = document.getElementById('idTwo').value || "..................";
    const details = document.getElementById('details').value || "..................";
    const date = document.getElementById('date').value;
    
    // تحديث التوقيعات أسفل الصفحة
    document.getElementById('sigOneName').innerText = p1 !== ".................." ? p1 : "الاسم..................";
    document.getElementById('sigTwoName').innerText = p2 !== ".................." ? p2 : "الاسم..................";

    let html = "";

    // اختيار القالب
    if (type === 'contract') {
        html = `
            <div class="title-doc">عقــــد اتفــــاق وعمــــل</div>
            <p>إنه في يوم <strong>${date}</strong>، تم الاتفاق والتعاقد بين كل من:</p>
            <p><strong>1. الطرف الأول:</strong> السيد/ة <strong>${p1}</strong>، حامل هوية رقم (${id1}).</p>
            <p><strong>2. الطرف الثاني:</strong> السيد/ة <strong>${p2}</strong>، حامل هوية رقم (${id2}).</p>
            <br>
            <p><strong>تمهيد:</strong><br>حيث يرغب الطرف الأول في الحصول على خدمات الطرف الثاني، فقد اتفق الطرفان وهما بكامل أهليتهما المعتبرة شرعاً وقانوناً على البنود التالية:</p>
            <p><strong>البند الأول:</strong> يعتبر التمهيد السابق جزءاً لا يتجزأ من هذا العقد.</p>
            <p><strong>البند الثاني (موضوع العقد):</strong><br>يلتزم الطرف الثاني بتقديم ما يلي:<br>${details}</p>
            <p><strong>البند الثالث:</strong><br>يلتزم الطرف الأول بدفع المستحقات المتفق عليها فور إتمام الأعمال.</p>
            <br><p>وإثباتاً لما تقدم، تحرر هذا العقد من نسختين بيد كل طرف نسخة للعمل بموجبها.</p>
        `;
    } 
    else if (type === 'commitment') {
        html = `
            <div class="title-doc">إقــــرار والتــــزام مـالــــي</div>
            <p>أقر أنا الموقع أدناه،</p>
            <p>الاسم: <strong>${p1}</strong> <br> رقم الهوية: <strong>${id1}</strong></p>
            <br>
            <p>بأنني مدين للسيد/ة: <strong>${p2}</strong> (هوية رقم: ${id2})</p>
            <p>بمبلغ أو التزام قدره/وصفه:</p>
            <p style="border:1px solid #000; padding:10px; text-align:center; font-weight:bold;">${details}</p>
            <br>
            <p>وأتعهد بسداد/تنفيذ هذا الالتزام في تاريخ أقصاه <strong>${date}</strong>.</p>
            <p>وهذا إقرار مني بذلك دون أي ضغوط أو إكراه، وأتحمل كافة المسؤوليات القانونية المترتبة على التأخير.</p>
        `;
    }
    else if (type === 'rental') {
        html = `
             <div class="title-doc">عقــــد إيجــــار</div>
             <p>بتاريخ <strong>${date}</strong>، أجر المؤجر: <strong>${p1}</strong> (هوية: ${id1})</p>
             <p>إلى المستأجر: <strong>${p2}</strong> (هوية: ${id2})</p>
             <br>
             <p><strong>العين المؤجرة:</strong><br> ${details}</p>
             <br>
             <p>وقد قبل المستأجر بذلك بحالة العقار الراهنة، ويلتزم بدفع الإيجار في مواعيده والمحافظة على العين المؤجرة.</p>
        `;
    }

    document.getElementById('documentContent').innerHTML = html;
}

// دالة لتغيير القالب وإفراغ الخانات إذا أردت (اختياري)
function updateTemplate() {
    updateContent();
}
