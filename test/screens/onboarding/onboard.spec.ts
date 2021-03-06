import {setApp, stopApp, TIMEOUT} from "../setup";
import {Application} from "spectron";
import {expect} from "chai";
import {OnBoardingRoutes, Routes} from "../../../src/renderer/constants/routes";

jest.setTimeout(TIMEOUT);

describe("Onboarding start screen", () => {
    let app: Application;

    beforeEach(async () => {
        app = await setApp(Routes.ONBOARD_ROUTE_EVALUATE(OnBoardingRoutes.SIGNING));
    });

    afterEach(async () => {
        await stopApp(app);
    });

    it("has rendered properly", async function() {
        const {client} = app;
        expect(await client.isExisting(".back-tab")).to.be.true;
        expect((await client.elements(".step")).value.length).to.be.equal(6);
        const goButtonText = await client.getAttribute("#import", "textContent");
        expect(goButtonText).to.be.equal("IMPORT");
        const registerButtonText = await client.getAttribute("#generate", "textContent");
        expect(registerButtonText).to.be.equal("GENERATE");
        const currentStep = await client.getAttribute(".step.current", "textContent");
        expect(currentStep).to.be.equal("Signing key");
    });
    //
    // it("back button leads to login", async function() {
    //     const {client} = app;
    //     await client.waitForVisible(".back-tab");
    //     await client.$(".back-tab").click().pause(20000);
    //     const url = await client.getUrl();
    //     expect(url.endsWith(Routes.LOGIN_ROUTE)).to.be.true;
    // });

});
