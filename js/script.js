/*jslint browser: true, devel: true */
/* CP2077//FAN — фанатский сайт об игре Cyberpunk 2077.
   Модули: мобильное меню, слайдер, FAQ-аккордеон,
   форма подписки (localStorage + fetch), фоновое видео. */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ---------- МОБИЛЬНОЕ МЕНЮ ---------- */

    const burger = document.getElementById("burger");
    const mmenu = document.getElementById("mmenu");
    const mmenuClose = document.getElementById("mmenu-close");

    const openMenu = function () {
        mmenu.classList.add("open");
        burger.setAttribute("aria-expanded", "true");
        document.body.classList.add("no-scroll");
    };

    const closeMenu = function () {
        mmenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
    };

    if (burger && mmenu) {
        burger.addEventListener("click", function () {
            if (mmenu.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (mmenuClose) {
        mmenuClose.addEventListener("click", closeMenu);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && mmenu.classList.contains("open")) {
            closeMenu();
        }
    });

    if (mmenu) {

        // Раскрывающиеся подпункты мобильного меню
        const menuToggles = mmenu.querySelectorAll(".mmenu-toggle");

        menuToggles.forEach(function (toggle) {
            toggle.addEventListener("click", function () {
                const expanded = toggle.getAttribute(
                    "aria-expanded"
                ) === "true";
                const submenu = toggle.nextElementSibling;

                if (expanded) {
                    toggle.setAttribute("aria-expanded", "false");
                } else {
                    toggle.setAttribute("aria-expanded", "true");
                }

                if (expanded) {
                    submenu.style.maxHeight = "0px";
                } else {
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
                }
            });
        });

        // Клик по любой ссылке меню закрывает его
        const menuLinks = mmenu.querySelectorAll(".mmenu-link");

        menuLinks.forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });
    }

    /* ---------- СЛАЙДЕР МЕДИА-ГАЛЕРЕИ ---------- */

    const slider = document.getElementById("slider");
    const track = document.getElementById("slider-track");
    const btnPrev = document.getElementById("slider-prev");
    const btnNext = document.getElementById("slider-next");
    const dotsBox = document.getElementById("slider-dots");

    if (slider && track && btnPrev && btnNext && dotsBox) {
        const slides = track.querySelectorAll(".slide");
        const gap = 14;
        const autoDelay = 5000;

        let perView = 1;
        let positionCount = 1;
        let currentPage = 0;
        let autoTimer = null;

        const calcPerView = function () {
            const width = window.innerWidth;
            if (width >= 992) {
                return 3;
            }
            if (width >= 576) {
                return 2;
            }
            return 1;
        };

        const applyTransform = function () {
            const viewport = track.parentElement;
            const gapSum = (perView - 1) * gap;
            const slideWidth = (viewport.clientWidth - gapSum) / perView;
            const offset = currentPage * (slideWidth + gap);
            track.style.transform = "translateX(" + (0 - offset) + "px)";
        };

        const markActiveDot = function () {
            const dots = dotsBox.querySelectorAll(".slider-dot");

            dots.forEach(function (dot, index) {
                if (index === currentPage) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        };

        const goToPage = function (page) {
            const maxPosition = positionCount - 1;

            currentPage = page;

            if (currentPage < 0) {
                currentPage = maxPosition;
            }
            if (currentPage > maxPosition) {
                currentPage = 0;
            }

            applyTransform();
            markActiveDot();
        };

        const nextPage = function () {
            goToPage(currentPage + 1);
        };

        const resetAuto = function () {
            window.clearInterval(autoTimer);
            autoTimer = window.setInterval(nextPage, autoDelay);
        };

        const buildDots = function () {
            dotsBox.textContent = "";

            const positions = [];

            let index = 0;
            while (index < positionCount) {
                positions.push(index);
                index = index + 1;
            }

            positions.forEach(function (pageNumber) {
                const dot = document.createElement("button");

                dot.type = "button";
                const label = "Перейти к слайду " + (pageNumber + 1);

                if (pageNumber === currentPage) {
                    dot.className = "slider-dot active";
                } else {
                    dot.className = "slider-dot";
                }
                dot.setAttribute("aria-label", label);
                dot.addEventListener("click", function () {
                    goToPage(pageNumber);
                    resetAuto();
                });
                dotsBox.appendChild(dot);
            });
        };

        const layout = function () {
            perView = calcPerView();
            positionCount = slides.length - perView + 1;

            if (currentPage > positionCount - 1) {
                currentPage = positionCount - 1;
            }

            buildDots();
            applyTransform();
            markActiveDot();
        };

        btnPrev.addEventListener("click", function () {
            goToPage(currentPage - 1);
            resetAuto();
        });

        btnNext.addEventListener("click", function () {
            goToPage(currentPage + 1);
            resetAuto();
        });

        // Стрелки клавиатуры, когда фокус внутри слайдера
        slider.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                goToPage(currentPage - 1);
                resetAuto();
            }
            if (event.key === "ArrowRight") {
                goToPage(currentPage + 1);
                resetAuto();
            }
        });

        // Пауза автопрокрутки при наведении и фокусе
        slider.addEventListener("mouseenter", function () {
            window.clearInterval(autoTimer);
        });

        slider.addEventListener("mouseleave", resetAuto);

        slider.addEventListener("focusin", function () {
            window.clearInterval(autoTimer);
        });

        slider.addEventListener("focusout", resetAuto);

        let resizeTimer = null;

        window.addEventListener("resize", function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(layout, 200);
        });

        layout();
        resetAuto();
    }

    /* ---------- FAQ-АККОРДЕОН ---------- */

    const faqButtons = document.querySelectorAll(".faq-btn");

    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const item = button.closest(".faq-item");
            const answer = item.querySelector(".faq-a");
            const expanded = button.getAttribute(
                "aria-expanded"
            ) === "true";

            if (expanded) {
                button.setAttribute("aria-expanded", "false");
            } else {
                button.setAttribute("aria-expanded", "true");
            }

            if (expanded) {
                item.classList.remove("open");
                answer.style.maxHeight = "0px";
            } else {
                item.classList.add("open");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* ---------- ФОРМА ПОДПИСКИ ---------- */

    const subscribeForm = document.getElementById("subscribe-form");
    const submitBtn = document.getElementById("form-submit");
    const formStatus = document.getElementById("form-status");
    const fieldName = document.getElementById("field-name");
    const fieldEmail = document.getElementById("field-email");
    const fieldMsg = document.getElementById("field-msg");
    const fieldPolicy = document.getElementById("field-policy");

    if (subscribeForm && submitBtn && formStatus) {

        // 1. Черновик в localStorage: восстановление при загрузке
        if (localStorage.getItem("fan_name")) {
            fieldName.value = localStorage.getItem("fan_name");
        }
        if (localStorage.getItem("fan_email")) {
            fieldEmail.value = localStorage.getItem("fan_email");
        }
        if (localStorage.getItem("fan_msg")) {
            fieldMsg.value = localStorage.getItem("fan_msg");
        }
        if (localStorage.getItem("fan_policy") === "true") {
            fieldPolicy.checked = true;
        }

        const saveDraft = function () {
            localStorage.setItem("fan_name", fieldName.value);
            localStorage.setItem("fan_email", fieldEmail.value);
            localStorage.setItem("fan_msg", fieldMsg.value);
            localStorage.setItem(
                "fan_policy",
                String(fieldPolicy.checked)
            );
        };

        [fieldName, fieldEmail, fieldMsg].forEach(function (input) {
            input.addEventListener("input", saveDraft);
        });

        fieldPolicy.addEventListener("change", saveDraft);

        // 2. Отправка без перезагрузки через fetch
        subscribeForm.addEventListener("submit", function (event) {
            event.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = "Отправка...";
            formStatus.textContent = "Передача данных в Night City...";
            formStatus.className = "form-status mono-note";

            const formData = new FormData(subscribeForm);
            const msgError = "Ошибка отправки. Попробуйте позже.";

            fetch(subscribeForm.action, {
                body: formData,
                headers: {
                    Accept: "application/json"
                },
                method: "POST"
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Ошибка сервера");
                    }

                    formStatus.textContent = "Готово! Вы в списке фан-клуба.";
                    formStatus.className = "form-status mono-note ok";
                    subscribeForm.reset();

                    localStorage.removeItem("fan_name");
                    localStorage.removeItem("fan_email");
                    localStorage.removeItem("fan_msg");
                    localStorage.removeItem("fan_policy");
                })
                .catch(function () {
                    formStatus.textContent = msgError;
                    formStatus.className = "form-status mono-note err";
                })
                .then(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Отправить";
                });
        });
    }

    /* ---------- ФОНОВОЕ ВИДЕО ---------- */

    const heroVideo = document.querySelector(".hero-video");

    if (heroVideo) {
        const playPromise = heroVideo.play();

        if (playPromise !== undefined) {
            playPromise.catch(function () {
                // Автозапуск заблокирован браузером — останется кадр-постер
                window.console.warn(
                    "Автовоспроизведение видео недоступно"
                );
            });
        }
    }
});
