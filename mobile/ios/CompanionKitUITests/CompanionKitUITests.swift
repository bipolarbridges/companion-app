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

    func testExample() throws {
        // UI tests must launch the application that they test.
      let app = XCUIApplication()
      setupSnapshot(app)
      app.launch()
                  
      app.otherElements["email"].waitForExistence(timeout: 30)

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

      let passwordTextField = app.descendants(matching: .any)["passwordtextfield"]
      passwordTextField.tap()
      passwordTextField.setText(text: SIGNIN_PASSWORD, application: app)
      app.keyboards.buttons["done"].tap()
      sleep(1)
      snapshot("loggedIn")
      
      let skipButton = app.descendants(matching: .any)["skipBtn"]
      skipButton.tap()
      sleep(1)
      snapshot("home")
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
