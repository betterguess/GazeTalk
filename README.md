# Running and installing Gazetalk
To install dependencies for the site run
```bash
npm install
```

### Running

To run Gazetalk website run at root
```bash
npm run dev -- --host
```
Then, navigate to the address displayed in your terminal (usually something like `http://localhost:5173` or your network IP if accessed remotely).
# Data collection server
Navigate to `Gazetalk/server`

To install the python dependencies run :
```bash
pip install flask flask-cors
```

To run the data collection server run
```bash
python server.py 
# or
python3 server.py
```

if there is trouble running the python data collection server try to use ``python3 ``
If you are on a linux envioment and want to run it in the background you can use ``nohup``
```bash
apt install nohup
nohup python server.py &
```

The files will be saved in the folder ``json_data/``


# Structure of GazeTalk
The `src\App.jsx` tells other components the different dynamic data the program is in currently and passes it down from component to component. The program is mainly organized in the following folders.

### Components
GazeTalk is structured around components and these can be found in `src/components`. They are described in the Thesis, but they are placed here to have them centralized in one folder and can be reused given arguments. 

### Layouts
The Layouts are described in the Design chapter and here we define the different layouts used throughout the application. For future development layouts can be defined and referenced in the `src/layouts/LayoutPicker.jsx`. This file will determine what layout component the user will get with the help of the input from the `src\App.jsx` component.

### Config
Here some hardcoded tiles are written so we ensure that different views have the buttons that belong to them. The file `src/config/config.js` is here to compress the import lines for the components referencing the configs to only 1 import. 

### Constants/Singleton/Utils
In these folders more some of the different hardcoded values and utility functions are added. They are placed here to remove some of the logic the components otherwise would entail.

### Tests
Tests are defined in `src/tests` and in here different folders are contained to to organize what the test files are testing. You can run these by typing:
```npm test```
or for a specific test:
```npx jest src/tests/views/Configs.test.js```

# CI/CD
Right now the application is using Husky `.hsuky/` and in here we have created a condition `.hsuky/pre-commit` that tells husky to stop the commit if some tests fail. This condition can be removed my removing the file or more conditions can be added.