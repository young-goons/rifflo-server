# young-goons [![Build Status](https://travis-ci.com/young-goons/rifflo.svg?branch=master)](https://travis-ci.com/young-goons/rifflo)

## Prerequisites

* npm (for macOS, run "brew install node" on terminal)

  Run "npm install" in the client directory to install every dependency in package.json

* MySQL (8.0.15-community)

* Python packages

  Activate virtual environment (https://docs.python.org/3/tutorial/venv.html),
  move to server directory, and install packages using "pip install -r requirements.txt"
  
## Notes

### Downloading packages

* npm (client)

  Whenever you download a package, use "npm install --save <package name>"
  so that the downloaded package name is saved to package.json
  
* Python (server)

  Always work on the virtual environment you set up for this project.
  After you download/update a package using pip, run "pip freeze > requirements.txt"
  and push the requirements.txt file to the repo.

* ffmpeg (for audio processing in the backend)

    brew install ffmpeg
