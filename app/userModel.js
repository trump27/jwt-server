function loadUser() {
  return require('./users')
}

module.exports.getUser = function(param) {
  /*
  * param: {id, password}
  */

  if (param.id=='' || param.password=='') return null;

  const users = loadUser()
  const user = users.find((v) => v.id === param.id)
  console.log('user', user)
  if (user == undefined) return null;
  if (user.password != param.password) return null;
  // find one
  return {id: user.id, name: user.name};
}