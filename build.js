
require('source-map-support').install({ environment: 'node', hookRequire: true, handleUncaughtExceptions: true })
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

const moduleFolder = path.join(__dirname, 'node_modules', 'open')

function bundle(name, entry, dest){
	return new Promise((resolve, reject) => {
		const opts = {
		  entry,
		  target: 'node',
		  output: {
		    library: name,
		    libraryTarget: 'umd',
		    filename: 'index.js',
		    path: dest
		  },
		  resolve: { symlinks: false },
		  module: {
			  rules: [
			    {
			      test: /\.m?js$/,
			      exclude: /(node_modules|bower_components)/,
			      use: {
			        loader: 'babel-loader',
			        options: {
			          presets: ['@babel/preset-env']
			        }
			      }
			    }
			  ]
		  }
		}

		webpack(opts).run((err, stats) => {
		  if (err || stats.hasErrors()) {
		  	if (err)
			  	console.log(err)
			else {
				if ((((stats || {}).compilation || {}).errors || []).length)
					stats.compilation.errors.forEach(err => {
						console.log(err)
					})
				else
					console.log('Unknown bundling error for module: ' + name)
			}
		  	reject({ errors: true })
		  	return
		  }
		  fs.copyFileSync(path.join(moduleFolder, 'xdg-open'), path.join(__dirname, 'xdg-open'))
		  resolve({ success: true })
		})
	})
}

function startBuild() {
	const dest = path.join(__dirname, 'index.js')
	if (fs.existsSync(dest))
		fs.unlinkSync(dest)
	const entry = path.join(moduleFolder, 'index.js')
	bundle('open', entry, __dirname)
		.then((resp) => {
			console.log('Bundle complete: ', resp)
		})
		.catch(err => {
			console.error(err)
		})
}

startBuild()