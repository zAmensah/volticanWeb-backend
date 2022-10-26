exports.testChannel = (req, res) => {
  let dateCheck = new Date();

  let expireDate = new Date(dateCheck.setFullYear(dateCheck.getFullYear() + 4));

  let dateTest = expireDate.getUTCMonth();

  if (dateTest < 10) {
    dateTest = "0" + dateTest;
  }

  console.log(dateTest);

  // let shortDate = expireDate.getMonth() + 1 + "/" + expireDate.getUTCFullYear();

  // console.log(expireDate);
  // console.log(shortDate);

  // let shortDate = ()
  // console.log(dateCheck);

  // let longDate = (dateCheck.)
};
