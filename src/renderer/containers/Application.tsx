import {hot} from "react-hot-loader/root";
import React, {useEffect} from "react";
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {ReactElement} from "react";
import OnboardContainer from "../containers/Onboard/OnboardContainer";
import {BeaconChain} from "../services/docker/chain";
import {LoginContainer} from "./Login/LoginContainer";
import {Routes} from "../constants/routes";
import {DashboardContainer} from "./Dashboard/DashboardContainer";
import {CheckPasswordContainer} from "./AddValidator/CheckPassword";
import {ValidatorDetailsContainer} from "./ValidatorDetails/ValidatorDetailsContainer";

const Application = (): ReactElement => {
    useEffect(() => {
        async function afterLoad(): Promise<void> {
            await BeaconChain.startAllLocalBeaconNodes();
        }

        afterLoad();
    }, []);

    return (
        <div className="cg-app">
            <Router>
                <Switch>
                    <Route path={Routes.ONBOARD_ROUTE} component={OnboardContainer}/>
                    <Route path={Routes.LOGIN_ROUTE} component={LoginContainer}/>
                    <Route path={Routes.DASHBOARD_ROUTE} component={DashboardContainer}/>
                    <Route path={Routes.CHECK_PASSWORD} component={CheckPasswordContainer}/>
                    <Route path={Routes.VALIDATOR_DETAILS} component={ValidatorDetailsContainer}/>
                    <Redirect from="/" to={Routes.LOGIN_ROUTE}/>
                </Switch>
            </Router>
        </div>
    );
};
export default hot(Application);
