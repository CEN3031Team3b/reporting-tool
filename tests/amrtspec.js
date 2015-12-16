// spec.js
describe('Amazon Marketplace reporting tool', function() {
  
  //this is the signin test
  it('signin', function() {
    browser.get('http://localhost:3000/authentication/signin');
    //These are valid credentials
    element(by.id('username')).sendKeys('noahpresser');
    element(by.id('password')).sendKeys('password');

    element(by.id('submit')).click();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/products'); // This is correct!
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
});