"use strict";

const Hexo = require("hexo");

exports.handler = (event,context,callback) => {

	/* Load the Node Modules for Git */
	var Git = require("nodegit");

	let cloneOpts = {
		checkoutBranch: "source",
		fetchOpts: {
			callbacks: {
				credentials: (url,username) => {
					return Git.Cred.sshKeyNew(
						username,
						`keys/${process.env["GIT_SSH_PUBLIC_KEY"]}`,
						`keys/${process.env["GIT_SSH_PRIVATE_KEY"]}`,
						""
					);
				}
			}
		}
	};

	Git.Clone(process.env["GIT_REPO_URL"], "tmp/src", cloneOpts)
		.then( (repo) => {
			console.info(`Checking out ${process.env["GIT_REPO_URL"]}`);
			var hexo = new Hexo("tmp/src", {});
			hexo.init().then( () => {
				console.info("Running Hexo Generate");
				hexo.call("generate",{})
					.then( () => {
						return hexo.exit();
					})
					.catch( () => {
						return hexo.exit();
					});
			});

		})
		.catch( (repo) => {
			//console.info("Error",repo);
			callback(repo);
		});
};

/*
exports.handler({},{},function(err,data){
	if(err) { console.error(new Error(err)); return; }
	console.info(data);
});
*/
