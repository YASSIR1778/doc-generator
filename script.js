/**
 * ====================================================================
 * 🔴 منطقة لوحة التحكم (ADMIN DASHBOARD)
 * هنا يمكنك إضافة نماذج جديدة أو تعديل النصوص
 * ====================================================================
 */

const templatesDB = [
    // --- النموذج الأول: عقد عمل ---
    {
        id: 'contract',
        name: '👔 عقد عمل وتوظيف',
        docTitle: 'عقــــد عمــــل',
        content: `
            <p>إنه في يوم <span class="highlight">\${date}</span>، تم الاتفاق بين:</p>
            <p><strong>1. الطرف الأول:</strong> السيد/ة <span class="highlight">\${p1}</span> (صاحب العمل)، هوية رقم: \${id1}</p>
            <p><strong>2. الطرف الثاني:</strong> السيد/ة <span class="highlight">\${p2}</span> (الموظف)، هوية رقم: \${id2}</p>
            <br>
            <h3>التمهيد:</h3>
            <p>حيث يرغب الطرف الأول في توظيف الطرف الثاني لديه، فقد اتفق الطرفان على الآتي:</p>
            <h3>بنود العقد:</h3>
            <div style="background:#f9f9f9; padding:15px; border-right:4px solid #333;">\${details}</div>
            <p>يلتزم الطرف الثاني بأداء العمل الموكل إليه بأمانة وإخلاص، ويلتزم الطرف الأول بدفع الرواتب والمستحقات.</p>
        `
    },

    // --- النموذج الثاني: عمل حر (Freelance) ---
    {
        id: 'freelance',
        name: '💻 اتفاقية عمل حر (Freelance)',
        docTitle: 'اتفاقيــة خدمــات مســتقلة',
        content: `
            <p>التاريخ: <span class="highlight">\${date}</span></p>
            <table style="width:100%; border-collapse:collapse; margin:20px 0;">
                <tr><td style="padding:10px; border:1px solid #ddd; background:#eee; width:30%;">العميل</td><td style="padding:10px; border:1px solid #ddd;">\${p1}</td></tr>
                <tr><td style="padding:10px; border:1px solid #ddd; background:#eee;">المستقل</td><td style="padding:10px; border:1px solid #ddd;">\${p2}</td></tr>
            </table>
            <h3>نطاق العمل (Scope of Work):</h3>
            <p>يقوم المستقل بتنفيذ المهام التالية:</p>
            <div style="border:1px dashed #555; padding:15px;">\${details}</div>
            <p>لا يعتبر هذا العقد توظيفاً دائماً، وتنتقل حقوق الملكية للعميل فور سداد كامل المبلغ.</p>
        `
    },

    // --- النموذج الثالث: إقرار دين ---
    {
        id: 'debt',
        name: '💰 إقرار دين مالي',
        docTitle: 'سند لأمر / إقرار دين',
        content: `
            <p>أقر أنا الموقع أدناه <strong>\${p2}</strong> (المدين) حامل هوية رقم (\${id2})،</p>
            <p>بأنني مدين للسيد/ة <strong>\${p1}</strong> (الدائن) حامل هوية رقم (\${id1})،</p>
            <br>
            <p>بمبلغ وقدره (أو تفاصيل الالتزام):</p>
            <h2 style="text-align:center; border:2px solid #000; padding:10px; margin:20px 0;">\${details}</h2>
            <p>وأتعهد بسداد هذا المبلغ بالكامل في موعد أقصاه <strong>\${date}</strong>.</p>
            <p>وهذا إقرار مني بذلك، والله خير الشاهدين.</p>
        `
    },

    // --- النموذج الرابع: عقد إيجار (مثال للإضافة) ---
    {
        id: 'rent',
        name: '🏠 عقد إيجار عقار',
        docTitle: 'عقــــد إيجــــار',
        content: `
            <p>المؤجر: <strong>\${p1}</strong> (هوية: \${id1})</p>
            <p>المستأجر: <strong>\${p2}</strong> (هوية: \${id2})</p>
            <br>
            <h3>العين المؤجرة:</h3>
            <p>قام المؤجر بتأجير العقار الموضح أدناه للمستأجر:</p>
            <div style="border:1px solid #ccc; padding:10px;">\${details}</div>
            <p>مدة الإيجار تبدأ من تاريخ <strong>\${date}</strong>.</p>
        `
    }
];

/**
 * ====================================================================
 * ⚙️ منطقة المحرك (ENGINE)
 * لا تقم بتعديل الأكواد أدناه إلا إذا كنت تعرف ما تفعل
 * ====================================================================
 */

let pads = [null, null]; // لتخزين بيانات لوحات التوقيع

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // 1. تعبئة القائمة المنسدلة من "لوحة التحكم" أعلاه
    const selectBox = document.getElementById('docType');
    selectBox.innerHTML = '';
    templatesDB.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.innerText = t.name;
        selectBox.appendChild(opt);
    });

    // 2. إعداد التواريخ
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    document.getElementById('footerDate').innerText = new Date().toLocaleDateString('ar-EG');
    
    // 3. تشغيل لوحات التوقيع
    setupSignaturePad(1);
    setupSignaturePad(2);
    
    // 4. استرجاع المسودة القديمة إن وجدت
    loadFromLocal();
    
    // 5. التحديث الأول للصفحة
    updateContent();
});

// --- الدالة الرئيسية: تحديث محتوى الورقة ---
function updateContent() {
    // جلب البيانات من الحقول
    const selectedId = document.getElementById('docType').value;
    const p1 = document.getElementById('partyOne').value || "..................";
    const id1 = document.getElementById('idOne').value || "..................";
    const p2 = document.getElementById('partyTwo').value || "..................";
    const id2 = document.getElementById('idTwo').value || "..................";
    const date = document.getElementById('date').value;
    
    // تحويل الأسطر الجديدة في التفاصيل إلى <br>
    let detailsRaw = document.getElementById('details').value;
    let details = detailsRaw ? detailsRaw.replace(/\n/g, '<br>') : "..................";

    // تحديث أسماء الموقعين في الأسفل
    document.getElementById('p1NameSig').innerText = p1 !== ".................." ? p1 : "الطرف الأول";
    document.getElementById('p2NameSig').innerText = p2 !== ".................." ? p2 : "الطرف الثاني";

    // البحث عن القالب المناسب في المصفوفة
    const template = templatesDB.find(t => t.id === selectedId);

    if (template) {
        // وضع العنوان
        document.getElementById('docTitleDisplay').innerText = template.docTitle;
        
        // استبدال المتغيرات (${p1}, ${date}...) بالبيانات الحقيقية
        let finalHtml = template.content
            .replace(/\${date}/g, date)
            .replace(/\${p1}/g, p1)
            .replace(/\${id1}/g, id1)
            .replace(/\${p2}/g, p2)
            .replace(/\${id2}/g, id2)
            .replace(/\${details}/g, details);

        document.getElementById('documentContent').innerHTML = finalHtml;
    }
}

// --- إعداد لوحة التوقيع (Canvas) ---
function setupSignaturePad(id) {
    const canvas = document.getElementById(`sigPad${id}`);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    pads[id-1] = { canvas, ctx, hasSignature: false };
    
    // خصائص القلم
    ctx.strokeStyle = "#1a237e"; // لون أزرق حبري
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // دوال الرسم
    function start(e) { isDrawing = true; ctx.beginPath(); const {x,y} = getCoords(e, canvas); ctx.moveTo(x,y); e.preventDefault(); }
    function move(e) { if(!isDrawing) return; const {x,y} = getCoords(e, canvas); ctx.lineTo(x,y); ctx.stroke(); pads[id-1].hasSignature=true; updateSigPreview(id); e.preventDefault(); }
    function end() { isDrawing = false; ctx.closePath(); }

    // دعم الماوس
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); canvas.addEventListener('mouseup', end); canvas.addEventListener('mouseout', end);
    // دعم اللمس (للموبايل)
    canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', move, {passive:false}); canvas.addEventListener('touchend', end);
}

// دالة مساعدة لتحديد مكان الإصبع/الماوس
function getCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.touches && e.touches[0]) { x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top; }
    else { x = e.offsetX; y = e.offsetY; }
    return {x, y};
}

// تحديث صورة التوقيع في الورقة
function updateSigPreview(id) {
    if(!pads[id-1].hasSignature) return;
    const img = document.getElementById(`digitalSig${id}`);
    img.src = pads[id-1].canvas.toDataURL();
    img.style.display = 'block';
    img.nextElementSibling.style.display = 'none'; // إخفاء كلمة "التوقيع"
}

// مسح التوقيع
function clearSignature(id) {
    const {canvas, ctx} = pads[id-1];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pads[id-1].hasSignature = false;
    const img = document.getElementById(`digitalSig${id}`);
    img.style.display='none'; img.src='';
    img.nextElementSibling.style.display='block';
}

// --- تغيير الثيم (الألوان) ---
function changeTheme() {
    document.body.className = document.getElementById('themeSelector').value;
}

// --- رفع الشعار ---
function uploadLogo() {
    const file = document.getElementById('logoUploader').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('logoImg').src = e.target.result;
            document.getElementById('logoPlace').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// --- تصدير PDF الاحترافي ---
function downloadPDF() {
    const element = document.getElementById('paperToDownload');
    const opt = {
        margin: 5,
        filename: `DocuMonster_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // تغيير نص الزر أثناء التحميل
    const btn = document.querySelector('.download-btn');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
    btn.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = oldText;
        btn.disabled = false;
    });
}

// --- الحفظ المحلي (Local Storage) ---
function saveToLocal() {
    const data = {
        type: document.getElementById('docType').value,
        theme: document.getElementById('themeSelector').value,
        p1: document.getElementById('partyOne').value,
        id1: document.getElementById('idOne').value,
        p2: document.getElementById('partyTwo').value,
        id2: document.getElementById('idTwo').value,
        details: document.getElementById('details').value
    };
    localStorage.setItem('docuMonsterData', JSON.stringify(data));
    alert('✅ تم حفظ المسودة في المتصفح بنجاح!');
}

function loadFromLocal() {
    const data = JSON.parse(localStorage.getItem('docuMonsterData'));
    if (data) {
        if(data.type) document.getElementById('docType').value = data.type;
        if(data.theme) { document.getElementById('themeSelector').value = data.theme; changeTheme(); }
        document.getElementById('partyOne').value = data.p1 || '';
        document.getElementById('idOne').value = data.id1 || '';
        document.getElementById('partyTwo').value = data.p2 || '';
        document.getElementById('idTwo').value = data.id2 || '';
        document.getElementById('details').value = data.details || '';
    }
}
