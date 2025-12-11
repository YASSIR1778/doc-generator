// ==========================================
// 1. قاعدة بيانات النماذج (Control Panel)
// ==========================================
const templatesDB = [
    {
        id: 'contract',
        name: 'عقد عمل وتوظيف 👔',
        docTitle: 'عقــــد عمــــل',
        content: `
            <p>إنه في يوم <span class="highlight">\${date}</span>، تم الاتفاق والتعاقد بين:</p>
            <p><strong>1. الطرف الأول:</strong> السيد/ة <span class="highlight">\${p1}</span> (صاحب العمل)، هوية: \${id1}</p>
            <p><strong>2. الطرف الثاني:</strong> السيد/ة <span class="highlight">\${p2}</span> (الموظف)، هوية: \${id2}</p>
            <br>
            <h3>التمهيد:</h3>
            <p>نظراً لحاجة الطرف الأول لخدمات الطرف الثاني، فقد اتفق الطرفان على الآتي:</p>
            <h3>بنود العقد:</h3>
            <div style="background:#f9f9f9; padding:15px; border-right:4px solid #333;">\${details}</div>
            <p>يلتزم الطرف الثاني بأداء العمل الموكل إليه بأمانة وإخلاص، ويلتزم الطرف الأول بدفع الأتعاب المتفق عليها.</p>
        `
    },
    {
        id: 'freelance',
        name: 'اتفاقية عمل حر (Freelance) 💻',
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
            <p>تنتقل حقوق الملكية الفكرية للعميل فور سداد كامل المبلغ المستحق.</p>
        `
    },
    {
        id: 'debt',
        name: 'إقرار دين مالي 💰',
        docTitle: 'سند لأمر / إقرار دين',
        content: `
            <p>أقر أنا الموقع أدناه <strong>\${p2}</strong> (المدين) حامل هوية رقم (\${id2})،</p>
            <p>بأنني مدين للسيد/ة <strong>\${p1}</strong> (الدائن) حامل هوية رقم (\${id1})،</p>
            <br>
            <p>بمبلغ وقدره (أو تفاصيل الدين):</p>
            <h2 style="text-align:center; border:2px solid #000; padding:10px; margin:20px 0;">\${details}</h2>
            <p>وأتعهد بسداد هذا المبلغ بالكامل في موعد أقصاه <strong>\${date}</strong> دون أي تأخير.</p>
            <p>وهذا إقرار مني بذلك، والله خير الشاهدين.</p>
        `
    },
    {
        id: 'custom',
        name: 'نموذج فارغ (مخصص) 📝',
        docTitle: 'وثيقـــــة',
        content: `
            <p>حرر بتاريخ: <strong>\${date}</strong></p>
            <p>بين السيد: <strong>\${p1}</strong> والسيد: <strong>\${p2}</strong></p>
            <br>
            <h3>الموضوع:</h3>
            <div style="min-height:200px;">\${details}</div>
        `
    }
];

// ==========================================
// 2. الكود البرمجي (المحرك)
// ==========================================

let pads = [null, null];

document.addEventListener('DOMContentLoaded', () => {
    // بناء القائمة المنسدلة من قاعدة البيانات
    const selectBox = document.getElementById('docType');
    selectBox.innerHTML = '';
    templatesDB.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.innerText = t.name;
        selectBox.appendChild(opt);
    });

    // الإعدادات الأولية
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('footerDate').innerText = new Date().toLocaleDateString('ar-EG');
    
    // تهيئة لوحات الرسم
    setupSignaturePad(1);
    setupSignaturePad(2);
    
    // استرجاع البيانات المحفوظة
    loadFromLocal();
    
    // التحديث الأول
    updateContent();
});

// --- وظيفة تحديث المحتوى ---
function updateContent() {
    const selectedId = document.getElementById('docType').value;
    const p1 = document.getElementById('partyOne').value || "..................";
    const id1 = document.getElementById('idOne').value || "..................";
    const p2 = document.getElementById('partyTwo').value || "..................";
    const id2 = document.getElementById('idTwo').value || "..................";
    const date = document.getElementById('date').value;
    let detailsRaw = document.getElementById('details').value;
    let details = detailsRaw ? detailsRaw.replace(/\n/g, '<br>') : "..................";

    // تحديث الأسماء في التوقيع
    document.getElementById('p1NameSig').innerText = p1 !== ".................." ? p1 : "الطرف الأول";
    document.getElementById('p2NameSig').innerText = p2 !== ".................." ? p2 : "الطرف الثاني";

    // البحث عن القالب وتنفيذه
    const template = templatesDB.find(t => t.id === selectedId);
    if (template) {
        document.getElementById('docTitleDisplay').innerText = template.docTitle;
        
        let html = template.content
            .replace(/\${date}/g, date)
            .replace(/\${p1}/g, p1)
            .replace(/\${id1}/g, id1)
            .replace(/\${p2}/g, p2)
            .replace(/\${id2}/g, id2)
            .replace(/\${details}/g, details);

        document.getElementById('documentContent').innerHTML = html;
    }
}

// --- وظيفة التوقيع الإلكتروني (Canvas) ---
function setupSignaturePad(id) {
    const canvas = document.getElementById(`sigPad${id}`);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    // تخزين المرجع
    pads[id-1] = { canvas, ctx, hasSignature: false };
    
    // إعدادات القلم
    ctx.strokeStyle = "#1a237e"; 
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function start(e) { isDrawing = true; ctx.beginPath(); const {x,y} = getCoords(e, canvas); ctx.moveTo(x,y); e.preventDefault(); }
    function move(e) { if(!isDrawing) return; const {x,y} = getCoords(e, canvas); ctx.lineTo(x,y); ctx.stroke(); pads[id-1].hasSignature=true; updateSigPreview(id); e.preventDefault(); }
    function end() { isDrawing = false; ctx.closePath(); }

    // Mouse Events
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); canvas.addEventListener('mouseup', end); canvas.addEventListener('mouseout', end);
    // Touch Events
    canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', move, {passive:false}); canvas.addEventListener('touchend', end);
}

function getCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.touches && e.touches[0]) { x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top; }
    else { x = e.offsetX; y = e.offsetY; }
    return {x, y};
}

function updateSigPreview(id) {
    if(!pads[id-1].hasSignature) return;
    const img = document.getElementById(`digitalSig${id}`);
    img.src = pads[id-1].canvas.toDataURL();
    img.style.display = 'block';
    img.nextElementSibling.style.display = 'none';
}

function clearSignature(id) {
    const {canvas, ctx} = pads[id-1];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pads[id-1].hasSignature = false;
    const img = document.getElementById(`digitalSig${id}`);
    img.style.display='none'; img.src='';
    img.nextElementSibling.style.display='block';
}

// --- وظائف المساعدة والتحميل ---
function changeTheme() { document.body.className = document.getElementById('themeSelector').value; }

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

function downloadPDF() {
    const element = document.getElementById('paperToDownload');
    const opt = {
        margin: 5,
        filename: `DocuMonster_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const btn = document.querySelector('.download-btn');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
    btn.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = oldText;
        btn.disabled = false;
    });
}

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
    alert('✅ تم حفظ المسودة بنجاح!');
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
