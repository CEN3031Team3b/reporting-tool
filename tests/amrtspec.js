// spec.js
describe('Amazon Marketplace reporting tool', function() {
 
 //  //this is the signin test
  it('signin', function() {
    browser.get('http://localhost:3000/authentication/signin');
    //These are valid credentials
    element(by.id('username')).sendKeys('noahpresser');
    element(by.id('password')).sendKeys('password');

    element(by.id('submit')).click();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products'); // This is correct!
  });

 //  //Navigation tests
  it('navigation tests', function() {
 	//when you click on full report sku, it should go to the proper view
  	browser.get('http://localhost:3000/products')
  	element(by.id('toskufull')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products/sku'); // This is correct!

	//when you click on full report for brand, it should go to the proper view
  	browser.get('http://localhost:3000/products')
  	element(by.id('settobrand')).click();
  	element(by.id('tobrandfull')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products/brand'); // This is correct!

    //go to signout page
    element(by.id('userdropdown')).click();
    element(by.id('signout')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/'); // This is correct!
  });

  //make sure non-users can't access product views and that it redirects properly
  it('user tests', function() {
    browser.get('http://localhost:3000/authentication/signin');
    //wait for load
    //These are valid credentials for signin
    element(by.id('username')).sendKeys('noahpresser');
    element(by.id('password')).sendKeys('password');
    element(by.id('submit')).click();


    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products'); // This is correct!

    //go to signout page
    element(by.id('userdropdown')).click();
    element(by.id('signout')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/'); // This is correct!
    //access pages you shouldn't be able to
    browser.get('http://localhost:3000/products')
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/authentication/signin'); // This is correct!
    browser.get('http://localhost:3000/products/sku')
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/authentication/signin'); // This is correct!
    browser.get('http://localhost:3000/products/brand')
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/authentication/signin'); // This is correct!

  });
  
  //This test will always pass if run on it's own, but fails otherwise. It is not included in the other video
  //Dashboard revenue test
  //make sure dashboard is loading revenue
  it('revenue test', function() {
    browser.get('http://localhost:3000/authentication/signin');
    //These are valid credentials
    element(by.id('username')).sendKeys('noahpresser');
    element(by.id('password')).sendKeys('password');

    element(by.id('submit')).click();
  
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products'); // This is correct!

    browser.get('http://localhost:3000/products')
    element(by.id('threshold')).sendKeys(10);
    element(by.id('fromTimeFrame')).sendKeys(07012015);
    element(by.id('toTimeFrame')).sendKeys(07152015);   
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products'); // This is correct!

    //did it populate with proper products? SKU
    //wait for the data to populate
    browser.manage().timeouts().implicitlyWait(5000);
    searchElm = element(by.id('revenue'));
    expect(searchElm.getText()).not.toEqual('0');

});

  //Navigation tests
  it('navigation tests', function() {
 	//when you click on full report sku, it should go to the proper view
  	browser.get('http://localhost:3000/products')
  	element(by.id('toskufull')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products/sku'); // This is correct!

	//when you click on full report for brand, it should go to the proper view
  	browser.get('http://localhost:3000/products')
  	element(by.id('settobrand')).click();
  	element(by.id('tobrandfull')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products/brand'); // This is correct!


  });

   


  //Database querying tests
  it('Database querying test', function() {
 	//when you query for data in a valid time range, the table will populate
    browser.get('http://localhost:3000/authentication/signin');
    browser.get('http://localhost:3000/authentication/signin');

    //These are valid credentials for signin
    element(by.id('username')).sendKeys('noahpresser');
    element(by.id('password')).sendKeys('password');
    element(by.id('submit')).click();    
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products'); // This is correct!

    element(by.id('toskufull')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products/sku'); // This is correct!

    browser.get('http://localhost:3000/products/sku')
    
  	element(by.id('threshold')).sendKeys(10);
  	element(by.id('fromTimeFrame')).sendKeys(07012015);
  	element(by.id('toTimeFrame')).sendKeys(07152015);  	
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products/sku'); // This is correct!

    //did it populate with proper products? SKU
    //wait for the data to populate
    browser.manage().timeouts().implicitlyWait(5000);
    searchBtnElm = element(by.repeater('x in products').row(1).column('cost'));
    expect(searchBtnElm.getText()).toEqual('60');

  });

}); 
