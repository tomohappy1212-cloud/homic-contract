/* ==================================================
   HOMIC CONTRACT SYSTEM
   contract.js
================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const planInputs = document.querySelectorAll(
    'input[name="plan"]'
  );

  const optionInputs = document.querySelectorAll(
    ".option"
  );

  const totalElement =
    document.getElementById("estimateTotal");

  const summaryTotalElement =
    document.getElementById("summaryTotal");

  const selectedPlanElement =
    document.getElementById("selectedPlan");

  const selectedOptionsElement =
    document.getElementById("selectedOptions");

  const agreementCheckbox =
    document.getElementById("estimateAgree");

  const estimateButton =
    document.getElementById("estimateButton");

  const customerName =
    document.getElementById("customerName");

  const shopName =
    document.getElementById("shopName");

  const customerEmail =
    document.getElementById("customerEmail");


  /* ==================================================
     FORMAT PRICE
  ================================================== */

  function formatPrice(price) {

    return new Intl.NumberFormat("ja-JP").format(price) + "円";

  }


  /* ==================================================
     GET SELECTED PLAN
  ================================================== */

  function getSelectedPlan() {

    const selected =
      document.querySelector(
        'input[name="plan"]:checked'
      );

    if (!selected) {

      return null;

    }

    return {

      name:
        selected.dataset.plan,

      price:
        Number(selected.value)

    };

  }


  /* ==================================================
     GET SELECTED OPTIONS
  ================================================== */

  function getSelectedOptions() {

    const selectedOptions = [];

    optionInputs.forEach(option => {

      if (option.checked) {

        selectedOptions.push({

          name:
            option.dataset.name,

          price:
            Number(option.value)

        });

      }

    });

    return selectedOptions;

  }


  /* ==================================================
     CALCULATE TOTAL
  ================================================== */

  function calculateTotal() {

    const plan =
      getSelectedPlan();

    const options =
      getSelectedOptions();


    let total = 0;


    if (plan) {

      total += plan.price;

    }


    options.forEach(option => {

      total += option.price;

    });


    return total;

  }


  /* ==================================================
     UPDATE SCREEN
  ================================================== */

  function updateEstimate() {

    const plan =
      getSelectedPlan();

    const options =
      getSelectedOptions();

    const total =
      calculateTotal();


    /* ---------- TOTAL ---------- */

    if (total === 0) {

      totalElement.textContent =
        "0円";

      summaryTotalElement.textContent =
        "0円";

    } else {

      totalElement.textContent =
        formatPrice(total);

      summaryTotalElement.textContent =
        formatPrice(total);

    }


    /* ---------- PLAN ---------- */

    if (plan) {

      selectedPlanElement.textContent =
        `${plan.name} / ${formatPrice(plan.price)}`;

    } else {

      selectedPlanElement.textContent =
        "未選択";

    }


    /* ---------- OPTIONS ---------- */

    if (options.length === 0) {

      selectedOptionsElement.textContent =
        "なし";

    } else {

      selectedOptionsElement.innerHTML =
        options
          .map(option => {

            return `
              ${option.name}
              (+${formatPrice(option.price)})
            `;

          })
          .join("<br>");

    }


    /* ---------- BUTTON ---------- */

    updateAgreementButton();

  }


  /* ==================================================
     AGREEMENT BUTTON
  ================================================== */

  function updateAgreementButton() {

    if (!estimateButton) {

      return;

    }


    const plan =
      getSelectedPlan();


    const agreed =
      agreementCheckbox &&
      agreementCheckbox.checked;


    const customer =
      customerName &&
      customerName.value.trim() !== "";


    const email =
      customerEmail &&
      customerEmail.value.trim() !== "";


    if (
      plan &&
      agreed &&
      customer &&
      email
    ) {

      estimateButton.disabled =
        false;

    } else {

      estimateButton.disabled =
        true;

    }

  }


  /* ==================================================
     PLAN EVENT
  ================================================== */

  planInputs.forEach(input => {

    input.addEventListener(
      "change",
      updateEstimate
    );

  });


  /* ==================================================
     OPTION EVENT
  ================================================== */

  optionInputs.forEach(input => {

    input.addEventListener(
      "change",
      updateEstimate
    );

  });


  /* ==================================================
     AGREEMENT EVENT
  ================================================== */

  if (agreementCheckbox) {

    agreementCheckbox.addEventListener(
      "change",
      updateAgreementButton
    );

  }


  /* ==================================================
     CUSTOMER EVENT
  ================================================== */

  [
    customerName,
    shopName,
    customerEmail

  ].forEach(input => {

    if (!input) {

      return;

    }


    input.addEventListener(
      "input",
      updateAgreementButton
    );

  });


  /* ==================================================
     CONFIRM ESTIMATE
  ================================================== */

  if (estimateButton) {

    estimateButton.addEventListener(
      "click",
      () => {

        const plan =
          getSelectedPlan();

        const options =
          getSelectedOptions();

        const total =
          calculateTotal();


        if (!plan) {

          alert(
            "プランを選択してください。"
          );

          return;

        }


        if (
          !customerName ||
          customerName.value.trim() === ""
        ) {

          alert(
            "お客様名を入力してください。"
          );

          return;

        }


        if (
          !customerEmail ||
          customerEmail.value.trim() === ""
        ) {

          alert(
            "メールアドレスを入力してください。"
          );

          return;

        }


        if (
          !agreementCheckbox ||
          !agreementCheckbox.checked
        ) {

          alert(
            "お見積り内容を確認して同意してください。"
          );

          return;

        }


        /* ==========================================
           CONTRACT NUMBER
        ========================================== */

        const now =
          new Date();

        const year =
          now.getFullYear();

        const month =
          String(
            now.getMonth() + 1
          ).padStart(2, "0");

        const day =
          String(
            now.getDate()
          ).padStart(2, "0");

        const random =
          Math.floor(
            1000 +
            Math.random() * 9000
          );


        const contractNumber =
          `HOMIC-${year}${month}${day}-${random}`;


        /* ==========================================
           SAVE ESTIMATE
        ========================================== */

        const estimateData = {

          contractNumber,

          customerName:
            customerName.value.trim(),

          shopName:
            shopName
              ? shopName.value.trim()
              : "",

          email:
            customerEmail.value.trim(),

          plan: {

            name:
              plan.name,

            price:
              plan.price

          },

          options,

          total,

          confirmedAt:
            now.toISOString()

        };


        localStorage.setItem(

          "homicEstimate",

          JSON.stringify(
            estimateData
          )

        );


        /* ==========================================
           SCREENSHOT / PAYMENT NOTICE
        ========================================== */

        alert(

          "お見積り内容を確定しました。\n\n" +

          `契約番号：${contractNumber}\n` +

          `総支払額：${formatPrice(total)}\n\n` +

          "この画面をスクリーンショットして保存してください。\n\n" +

          "その後、HOMIC指定の方法でお支払いください。\n\n" +

          "HOMIC側で入金を確認後、確認メールをお送りします。"

        );


        /* ==========================================
           SHOW CONFIRMED STATE
        ========================================== */

        estimateButton.textContent =
          "お見積り確定済み ✓";

        estimateButton.disabled =
          true;


        agreementCheckbox.disabled =
          true;


        /* ==========================================
           STORE CONFIRMATION STATE
        ========================================== */

        localStorage.setItem(

          "homicEstimateConfirmed",

          "true"

        );

      }

    );

  }


  /* ==================================================
     INITIALIZE
  ================================================== */

  updateEstimate();


});
