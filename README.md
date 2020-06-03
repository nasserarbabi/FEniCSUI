# FEniCSUI
A flexible web based user interface for FEniCS (finite element) solvers using Django local server and react application as front end. Once up and running, a 

- [Documentation](https://fenicsui.readthedocs.io/en/latest/)

## Getting started:

Currently the FEniCSUI is available for ubuntu users. Windows users can use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (WSL) to run the code in the windows environment. The following installation instructions are based on Ubuntu 18 or WSL 1.

##### 1. Docker:

The solver uses the docker image of FEniCS project to run the finite element code. So, the docker should be installed and running in your system. 

If you are using WSL services, [here](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly) is a comprehensive guide on how to use windows docker inside wsl 1.

If you have already had docker installed and running, skip to the **step 2**!

To install docker on Ubuntu run the following commands in the terminal:

```bash
sudo apt-get update
sudo apt install docker.io
```

and start the docker using system control:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

**OR** services:

```bash
sudo service docker start
```



You can make sure that the docker is up and running by:

```bash
docker info
# this shoud give you information about docker deamon

docker-compose --version
# you should get back your docker compose version
```

##### 2. gmsh:

We use gmsh to mesh the uploaded geometry (Step format supported). We use [pygmsh](https://pypi.org/project/pygmsh/) to call gmsh commands from web server backend, however, it requires the C++ libraries of gmsh to be installed on the system. The current mesh converters are based on gmsh version 3.0.6, which can be installed by:

```bash
sudo apt-get install -y gmsh=3.0.6+dfsg1-1
```

##### 3. python environment and dependencies

Clone the repository to a local directory:

```bash
git clone https://github.com/nasserarbabi/FEniCSUI.git
```

** If you do not have git on your system, install it via `sudo apt install git`

Go to the main directory:

```bash
cd FEniCSUI
```

Create a new virtual environment and activate it:

```bash
virtualenv venv
source venv/bin/activate
```

** If you do not have virtualenv, you can install it by `pip install virtualenv`

Then, install dependencies using:

```bash
pip install -r requirements.txt
```

Since this is the first time that the app is installed, the database for the Django backend should be initialized. To do this, please go to the `FEniCSUI/FEniCSUI` directory, and run the following commands on terminal:

```bash
cd FEniCSUI
python manage.py makemigrations
pyhton manage.py migrate
```

Once the database is initialized, you can run the application server by:

```bash
python manage.py runserver
```

Go to `localhost:8000` in your web browser. 

