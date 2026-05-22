/* ==========================================================================
   INTERACTIVIDAD Y LÓGICA DEL SITIO WEB DE LA NUTRIÓLOGA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFAQAccordion();
});

/* ==========================================================================
   1. NAVEGACIÓN Y MENÚ MÓVIL
   ========================================================================== */

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn-mobile');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animación del botón hamburguesa
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }
}

/* ==========================================================================
   2. PESTAÑAS DE HERRAMIENTAS (IMC / CALORÍAS)
   ========================================================================== */

function switchTool(toolName) {
    const tabBmi = document.getElementById('tab-btn-bmi');
    const tabCalories = document.getElementById('tab-btn-calories');
    const toolBmi = document.getElementById('tool-bmi');
    const toolCalories = document.getElementById('tool-calories');

    if (toolName === 'bmi') {
        tabBmi.classList.add('active');
        tabCalories.classList.remove('active');
        toolBmi.classList.add('active');
        toolCalories.classList.remove('active');
    } else {
        tabBmi.classList.remove('active');
        tabCalories.classList.add('active');
        toolBmi.classList.remove('active');
        toolCalories.classList.add('active');
    }
}

/* ==========================================================================
   3. CALCULADORA DE IMC (ÍNDICE DE MASA CORPORAL)
   ========================================================================== */

function calculateBMI(event) {
    event.preventDefault();

    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value) / 100; // a metros

    if (weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(1);
        
        // Elementos visuales
        const placeholder = document.getElementById('bmi-placeholder');
        const display = document.getElementById('bmi-display');
        const bmiValue = document.getElementById('bmi-value');
        const bmiStatus = document.getElementById('bmi-status');
        const bmiFeedback = document.getElementById('bmi-feedback-text');
        const marker = document.getElementById('bmi-marker');

        placeholder.classList.add('hidden');
        display.classList.remove('hidden');
        
        bmiValue.textContent = bmi;

        // Clasificación de IMC y cálculo de posición de marcador
        let status = '';
        let feedback = '';
        let markerPos = 50; // porcentaje inicial

        if (bmi < 18.5) {
            status = 'Bajo Peso';
            feedback = 'Tu peso corporal está por debajo de lo saludable. Te recomiendo estructurar un superávit calórico controlado y saludable enfocado en masa muscular y nutrientes esenciales.';
            // Mapear de 10 a 18.5 -> 0% a 25%
            markerPos = Math.max(0, Math.min(25, ((bmi - 10) / 8.5) * 25));
            bmiStatus.style.color = '#6EB5FF';
        } else if (bmi >= 18.5 && bmi < 25) {
            status = 'Rango Normal (Saludable)';
            feedback = '¡Excelente! Tu peso se encuentra en una categoría óptima y saludable. Continuar con hábitos de alimentación equilibrados y actividad física regular mantendrá este balance.';
            // Mapear de 18.5 a 25 -> 25% a 55%
            markerPos = 25 + (((bmi - 18.5) / 6.5) * 30);
            bmiStatus.style.color = '#4A6B56';
        } else if (bmi >= 25 && bmi < 30) {
            status = 'Sobrepeso';
            feedback = 'Tu peso se encuentra ligeramente elevado. Ajustes moderados en la ingesta calórica y entrenamiento de fuerza te ayudarán a reducir grasa corporal y ganar masa muscular de forma efectiva.';
            // Mapear de 25 a 30 -> 55% a 80%
            markerPos = 55 + (((bmi - 25) / 5) * 25);
            bmiStatus.style.color = '#EED535';
        } else {
            status = 'Obesidad';
            feedback = 'Un nivel de peso que puede incrementar el riesgo cardiovascular o metabólico. Te aconsejo iniciar un plan integral personalizado enfocado en desinflamar el cuerpo y construir hábitos saludables sin restricciones extremas.';
            // Mapear de 30 a 45 -> 80% a 100%
            markerPos = 80 + Math.min(20, (((bmi - 30) / 15) * 20));
            bmiStatus.style.color = '#E25E5E';
        }

        bmiStatus.textContent = status;
        bmiFeedback.textContent = feedback;
        marker.style.left = `${markerPos}%`;
    }
}

/* ==========================================================================
   4. CALCULADORA DE REQUERIMIENTO CALÓRICO & MACROS
   ========================================================================== */

function calculateCalories(event) {
    event.preventDefault();

    const gender = document.getElementById('cal-gender').value;
    const age = parseInt(document.getElementById('cal-age').value);
    const weight = parseFloat(document.getElementById('cal-weight').value);
    const height = parseFloat(document.getElementById('cal-height').value);
    const activity = parseFloat(document.getElementById('cal-activity').value);

    // Ecuación de Mifflin-St Jeor
    let tmb = 0;
    if (gender === 'male') {
        tmb = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        tmb = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = Math.round(tmb * activity);

    // Elementos visuales
    const placeholder = document.getElementById('calories-placeholder');
    const display = document.getElementById('calories-display');
    const caloriesVal = document.getElementById('calories-val');
    
    const carbG = document.getElementById('carb-g');
    const proteinG = document.getElementById('protein-g');
    const fatG = document.getElementById('fat-g');

    placeholder.classList.add('hidden');
    display.classList.remove('hidden');
    
    // Formatear calorías con separador de miles
    caloriesVal.textContent = tdee.toLocaleString('es-MX');

    // Macros estimados (45% Carbohidratos, 25% Proteínas, 30% Grasas)
    const carbs = Math.round((tdee * 0.45) / 4);
    const proteins = Math.round((tdee * 0.25) / 4);
    const fats = Math.round((tdee * 0.30) / 9);

    carbG.textContent = `${carbs}g`;
    proteinG.textContent = `${proteins}g`;
    fatG.textContent = `${fats}g`;

    // Efecto de carga en las barras
    setTimeout(() => {
        document.querySelector('.fill-carbs').style.width = '45%';
        document.querySelector('.fill-proteins').style.width = '25%';
        document.querySelector('.fill-fats').style.width = '30%';
    }, 100);
}

/* ==========================================================================
   5. EXPLORADOR Y FILTRADO DE RECETAS SALUDABLES + DETALLE (MODAL)
   ========================================================================== */

const RECIPES_DATA = [
    {
        title: "Bowl de Avena con Frutos Rojos y Chía",
        category: "Desayuno",
        prepTime: "10 min",
        calories: "320 kcal",
        ingredients: [
            "1/2 taza de hojuelas de avena integral",
            "1 taza de leche de almendras sin azúcar (o de tu preferencia)",
            "1 cucharada de semillas de chía",
            "1/2 taza de frutos rojos mixtos (fresas, arándanos, frambuesas)",
            "1 cucharadita de miel de abeja pura o jarabe de agave",
            "Un toque de canela en polvo y almendras fileteadas para decorar"
        ],
        steps: [
            "En una olla pequeña, mezcla la avena con la leche de almendras y la canela. Calienta a fuego medio durante 5-7 minutos hasta que espese.",
            "Retira del fuego y añade la cucharada de semillas de chía, mezclando bien.",
            "Sirve en un tazón hondo.",
            "Decora con los frutos rojos frescos por encima, las almendras fileteadas y añade un hilo de miel para un toque dulce saludable."
        ],
        macros: { carbs: "45g", proteins: "10g", fats: "8g" }
    },
    {
        title: "Salmón Glaseado con Ensalada de Quinoa",
        category: "Almuerzo",
        prepTime: "25 min",
        calories: "480 kcal",
        ingredients: [
            "1 filete de salmón fresco (150g)",
            "1/2 taza de quinoa cocida",
            "1 cucharadita de aceite de oliva extra virgen",
            "1 cucharadita de miel de abeja + 1 cucharadita de salsa de soja baja en sodio",
            "1/2 taza de pepino cortado en cubos",
            "1/2 taza de tomates cherry cortados por la mitad",
            "1/4 de aguacate en cubos",
            "Jugo de medio limón, sal y pimienta al gusto"
        ],
        steps: [
            "Sazona el filete de salmón con sal y pimienta. Mezcla la miel y la soja para el glaseado.",
            "Calienta una sartén con media cucharadita de aceite de oliva y cocina el salmón a fuego medio-alto 4 minutos por lado. Pincela con el glaseado en el último minuto.",
            "En un bowl, combina la quinoa cocida fría con el pepino, tomates cherry, aguacate y el resto del aceite de oliva.",
            "Añade el jugo de limón a la ensalada de quinoa y mezcla suavemente.",
            "Sirve la ensalada de quinoa como cama y coloca el filete de salmón glaseado encima."
        ],
        macros: { carbs: "38g", proteins: "32g", fats: "20g" }
    },
    {
        title: "Muffins Fit de Plátano y Avena",
        category: "Postre / Snack",
        prepTime: "20 min",
        calories: "140 kcal por pieza",
        ingredients: [
            "2 plátanos muy maduros (hechos puré)",
            "1 taza de harina de avena integral",
            "2 huevos medianos",
            "1 cucharadita de polvo para hornear",
            "1 cucharadita de extracto de vainilla pura",
            "1/4 taza de nueces picadas o chispas de chocolate amargo (85% cacao)"
        ],
        steps: [
            "Precalienta el horno a 180°C y engrasa un molde para muffins.",
            "En un bowl grande, aplasta los plátanos hasta formar un puré suave. Incorpora los huevos y la vainilla.",
            "Agrega la harina de avena y el polvo para hornear, integrando todo de forma envolvente con una espátula.",
            "Añade las nueces picadas o chispas de chocolate a la mezcla.",
            "Distribuye la masa equitativamente en el molde para muffins.",
            "Hornea por 15-18 minutos o hasta que al introducir un palillo, este salga completamente limpio."
        ],
        macros: { carbs: "22g", proteins: "4g", fats: "5g" }
    }
];

function filterRecipes(category) {
    const cards = document.querySelectorAll('#recipes-grid .recipe-card');
    const buttons = document.querySelectorAll('.recipe-filters .filter-btn');

    // Actualizar botones de filtro activos
    buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (category === 'all' && text.includes('todas')) {
            btn.classList.add('active');
        } else if (category === 'desayuno' && text.includes('desayunos')) {
            btn.classList.add('active');
        } else if (category === 'almuerzo' && text.includes('almuerzos')) {
            btn.classList.add('active');
        } else if (category === 'postre' && text.includes('snacks')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Ocultar / Mostrar recetas con animación
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

function openRecipeModal(index) {
    const recipe = RECIPES_DATA[index];
    const modal = document.getElementById('recipe-modal');
    const body = document.getElementById('modal-content-body');

    if (!recipe || !modal || !body) return;

    // Crear contenido dinámico del modal
    let ingredientsHTML = '';
    recipe.ingredients.forEach(ing => {
        ingredientsHTML += `<li><i class="fa-solid fa-carrot"></i> ${ing}</li>`;
    });

    let stepsHTML = '';
    recipe.steps.forEach((step, idx) => {
        stepsHTML += `<li><span class="step-num">${idx + 1}</span> <span>${step}</span></li>`;
    });

    body.innerHTML = `
        <div class="modal-recipe-header">
            <span class="modal-recipe-category">${recipe.category}</span>
            <h3 class="modal-recipe-title">${recipe.title}</h3>
            <div class="modal-recipe-meta">
                <span><i class="fa-regular fa-clock"></i> Tiempo: ${recipe.prepTime}</span>
                <span><i class="fa-solid fa-fire"></i> Calorías: ${recipe.calories}</span>
            </div>
        </div>
        
        <div class="modal-recipe-details">
            <div>
                <h4>Ingredientes necesarios</h4>
                <ul class="ingredients-list">
                    ${ingredientsHTML}
                </ul>
            </div>
            
            <div>
                <h4>Instrucciones de Preparación</h4>
                <ol class="steps-list">
                    ${stepsHTML}
                </ol>
            </div>
            
            <div class="modal-recipe-macros">
                <div class="macro-item">
                    <span class="macro-val">${recipe.macros.carbs}</span>
                    <span class="macro-lbl">Carbohidratos</span>
                </div>
                <div class="macro-item">
                    <span class="macro-val">${recipe.macros.proteins}</span>
                    <span class="macro-lbl">Proteínas</span>
                </div>
                <div class="macro-item">
                    <span class="macro-val">${recipe.macros.fats}</span>
                    <span class="macro-lbl">Grasas</span>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Detener scroll de fondo
}

function closeRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
}

/* ==========================================================================
   6. CARRUSEL DE TESTIMONIOS (SLIDER)
   ========================================================================== */

let currentTestimonialIndex = 0;

function updateTestimonialSlider() {
    const items = document.querySelectorAll('#testimonial-slider .testimonial-item');
    const dots = document.querySelectorAll('#slider-dots .dot');

    items.forEach((item, idx) => {
        if (idx === currentTestimonialIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    dots.forEach((dot, idx) => {
        if (idx === currentTestimonialIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextTestimonial() {
    const items = document.querySelectorAll('#testimonial-slider .testimonial-item');
    currentTestimonialIndex = (currentTestimonialIndex + 1) % items.length;
    updateTestimonialSlider();
}

function prevTestimonial() {
    const items = document.querySelectorAll('#testimonial-slider .testimonial-item');
    currentTestimonialIndex = (currentTestimonialIndex - 1 + items.length) % items.length;
    updateTestimonialSlider();
}

function goToTestimonial(index) {
    currentTestimonialIndex = index;
    updateTestimonialSlider();
}

/* ==========================================================================
   7. FORMULARIO E INTERACTIVIDAD DE BOOKING (AGENDADO SIMULADO)
   ========================================================================== */

function handleBooking(event) {
    event.preventDefault();

    const name = document.getElementById('book-name').value;
    const email = document.getElementById('book-email').value;
    const dateInput = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;
    const serviceSelect = document.getElementById('book-service');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;

    // Convertir fecha a formato amigable en español
    const dateObj = new Date(dateInput);
    // Ajustar por desfase horario local para evitar cambio de fecha al convertir
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = dateObj.toLocaleDateString('es-MX', options);

    // Elementos de pantalla de éxito
    const form = document.getElementById('appointment-form');
    const successView = document.getElementById('booking-success');
    const successPatient = document.getElementById('success-patient');
    const successDate = document.getElementById('success-date');
    const successTime = document.getElementById('success-time');
    const whatsappBtn = document.getElementById('whatsapp-confirm-btn');

    if (name && dateInput && time) {
        // Asignar valores dinámicos en la pantalla de éxito
        successPatient.textContent = name;
        successDate.textContent = dateString;
        successTime.textContent = time;

        // Construir URL de WhatsApp con el número de Andrea (6643176717 con prefijo de México 52)
        const whatsappPhone = "526643176717";
        const messageText = `Hola Lic. Andrea Otañez, me gustaría agendar una cita. Aquí están mis detalles:\n\nNombre: ${name}\nCorreo: ${email}\nServicio: ${serviceName}\nFecha: ${dateString}\nHorario: ${time}\n\n¡Quedo atento(a) a su confirmación!`;
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(messageText)}`;

        // Asignar URL al botón de confirmación
        if (whatsappBtn) {
            whatsappBtn.href = whatsappUrl;
        }

        // Ocultar formulario e insertar pantalla de éxito
        form.classList.add('hidden');
        successView.classList.remove('hidden');

        // Redirección automática elegante tras 1.2 segundos para excelente experiencia
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1200);
    }
}

function resetBookingForm() {
    const form = document.getElementById('appointment-form');
    const successView = document.getElementById('booking-success');

    form.reset();
    form.classList.remove('hidden');
    successView.classList.add('hidden');
}

/* ==========================================================================
   8. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Cerrar todas las demás preguntas primero
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Alternar el estado de la pregunta actual
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}


