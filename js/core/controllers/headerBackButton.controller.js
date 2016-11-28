/**
 * Copyright 2015 Longtail Ad Solutions Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 **/

(function () {

    angular
        .module('jwShowcase.core')
        .controller('HeaderBackButtonController', HeaderBackButtonController);

    /**
     * @ngdoc controller
     * @name jwShowcase.core.HeaderBackButtonController
     *
     * @requires $state
     * @requires $ionicHistory
     * @requires $ionicViewSwitcher
     * @requires jwShowcase.core.dataStore
     */
    HeaderBackButtonController.$inject = ['$state', '$ionicHistory', '$ionicViewSwitcher', 'dataStore'];
    function HeaderBackButtonController ($state, $ionicHistory, $ionicViewSwitcher, dataStore) {

        var vm = this;

        vm.backButtonClickHandler = backButtonClickHandler;

        ////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.HeaderBackButtonController#backButtonClickHandler
         * @methodOf jwShowcase.core.HeaderBackButtonController
         *
         * @description
         * Handle click event on the back button.
         *
         * @param {$event} event Synthetic event object.
         */
        function backButtonClickHandler () {

            var viewHistory         = $ionicHistory.viewHistory(),
                history             = viewHistory.histories[$ionicHistory.currentHistoryId()],
                backView            = viewHistory.backView,
                stack               = history ? history.stack : [],
                stackIndex          = history.cursor - 1,
                watchlistLength     = dataStore.watchlistFeed.playlist.length,
                watchProgressLength = dataStore.watchProgressFeed.playlist.length,
                stateName, stateParams;

            if (backView) {

                stateName   = backView.stateName;
                stateParams = backView.stateParams;

                // watchlist is empty, do not return to this state
                if (stateName === 'root.feed' && stateParams.feedId === dataStore.watchlistFeed.feedid && !watchlistLength) {
                    return goToDashboard();
                }

                // watchProgress is empty, do not return to this state
                if (stateName === 'root.feed' && stateParams.feedId === dataStore.watchProgressFeed.feedid && !watchProgressLength) {
                    return goToDashboard();
                }

                // return to backView, but prevent going though all video states. Only go back to the last video state
                // if the current state is not the video state.
                if (stateName !== 'root.video' || $state.$current.name !== 'root.video') {
                    $ionicViewSwitcher.nextDirection('back');
                    $ionicHistory.goBack();
                    return;
                }
            }

            if (stackIndex > 0) {

                while (stackIndex >= 0) {

                    // search until dashboard or feed state is found
                    if (stack[stackIndex].stateName !== 'root.video' && stack[stackIndex].stateId !== viewHistory.currentView.stateId) {
                        $ionicViewSwitcher.nextDirection('back');
                        stack[stackIndex].go();
                        return;
                    }

                    stackIndex--;
                }
            }

            // fallback to dashboard
            goToDashboard();
        }

        /**
         * Go to dashboard state with back transition
         */
        function goToDashboard () {

            $ionicViewSwitcher.nextDirection('back');
            $state.go('root.dashboard');
        }
    }

}());
