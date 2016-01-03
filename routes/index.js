exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.home = function(req, res){
	res.render('home', { title: 'HOME' });
}

exports.login = function(req, res){
	res.render('Log_In', { title: 'HOME' });
};

exports.logout = function(req, res){
	req.logout();
	req.session.destroy();
	res.render('home', { title: 'HOME' });
};