//
//  CompanionKitUITests.swift
//  CompanionKitUITests
//
//  Created by xwing on 2021-05-19.
//

import XCTest

class CompanionKitUITests: XCTestCase {
  
  let SIGNIN_EMAIL = "polarus.test.coach0@rowanlindsay.com"
  let SIGNIN_PASSWORD = "secret"

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.

    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    // func name MUST start with "test" in a XCTest file
    // screenshots are only captured when run with Fastlane
    func testScreenshots() throws {
      let app = XCUIApplication()
      setupSnapshot(app)
      app.launch()
      
      // Use waitForExistence as it can take a while for all the elements to appear on launch
      // If "skipBtn" is not on screen do the sign in flow
      if !(app.otherElements["skipBtn"].waitForExistence(timeout: 30)) {
        snapshot("01Launch")
        
        app.otherElements["email"].tap()
        sleep(1)
        snapshot("enterEmailScreen")
        
        let emailTextField = app.textFields["emailtextfield"]
        emailTextField.tap()
        emailTextField.setText(text: SIGNIN_EMAIL, application: app)
        app.keyboards.buttons["done"].tap()
        sleep(1)
        snapshot("enterPassword")
        
        sleep(1)

        // "passwordtextfield" does not show up in app.textFields so using app.descendants(matching: .any) here
        let passwordTextField = app.descendants(matching: .any)["passwordtextfield"]
        passwordTextField.tap()
        passwordTextField.setText(text: SIGNIN_PASSWORD, application: app)
        app.keyboards.buttons["done"].tap()
        sleep(1)
        snapshot("loggedIn")
      }
      
      let skipButton = app.descendants(matching: .any)["skipBtn"]
      skipButton.tap()
      sleep(1)
      snapshot("home")
      
      let checkInCard = app.descendants(matching: .any)["CheckInCard0"]
      checkInCard.tap()
      sleep(1)
      snapshot("checkIn")
      
      let back = app.otherElements["checkInDetailsback"]
      back.tap()
      sleep(10)
      
    }
  

}

// Adapted from https://stackoverflow.com/questions/32712036/xcode-ui-testing-typing-text-with-typetext-method-and-autocorrection

extension XCUIElement {
    // The following is a workaround for inputting text in the
    //simulator when the keyboard is hidden
    func setText(text: String, application: XCUIApplication) {
        UIPasteboard.general.string = text
        doubleTap()
        application.menuItems["Paste"].tap()
    }
}
