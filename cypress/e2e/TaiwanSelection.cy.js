

describe("選情地圖移動測試", () => {
  it("testing", () => {
    const animationTime = 1500;
    // cy.visit("https://allenstu6311.github.io/sideProject/Taiwan_map/");
    cy.visit("http://localhost:5173/TaiwanSelection");
    cy.viewport(1450, 750);

    cy.intercept("GET", "/data/TaiwanSelection/topoJson/selection/*").as("getData");

    // 發出所有請求（假設這裡是應用初始化時自動觸發的 22 次請求）
    cy.wait(Array(22).fill("@getData"))// 一次性等待所有 22 次請求完成

    let currDeep = 0;

    function reset() {
      for (let i = 0; i < currDeep; i++) {
        cy.get(".back").click();
        cy.wait(animationTime);
      }
      currDeep = 0;
    }

    function moveTest(taraget, deep) {
      currDeep = deep;
      cy.get(taraget)
        .children()
        .each((item, index) => {
          if (index === 0) {
            cy.wrap(item).click({ force: true });
            cy.wait(animationTime);
          }
        });
    }

    // 等待loading結束
    cy.get(".spinner-border")
    .should('not.exist')

   
    cy.wait(animationTime);
    // pc測試
    moveTest(".map-group .selected-county-country", 1);
    moveTest(".map-group .selected-county-towns", 2);
    moveTest(".map-group .selected-county-villages", 3);
    reset();

    cy.get(".window-pc input").type("桃園市");
    moveTest('.window-pc .location-options',1)

    cy.get(".window-pc input").type("桃園市大園區");
    moveTest('.window-pc .location-options',2)

    cy.get(".window-pc input").type("桃園市大園區竹圍里");
    moveTest('.window-pc .location-options',3)
    reset()

    // H5測試
    cy.viewport(550, 750);
    cy.get(".search-button").click();

    cy.get(".search-h5 input").type("桃園市");
    moveTest('.search-h5 .location-options',1);

    cy.get(".search-button").click();

    cy.get(".search-h5 input").type("桃園市大園區");
    moveTest('.search-h5 .location-options',2)

    cy.get(".search-button").click();

    cy.get(".search-h5 input").type("桃園市大園區竹圍里");
    moveTest('.search-h5 .location-options',3);

    cy.log("測試完成 ✅")
  });
});
