# FEniCSUI
A flexible web based user interface for [FEniCS](http://fenicsproject.org/) (finite element) solvers. FEniCSUI provides finite element solver developers with easy to use tools to build simple, yet powerful, web-based user interfaces. The FEniCSUI is easy to use, and no experience with JavaScript or web-development is required. 

- [Documentation](https://fenicsui.readthedocs.io/en/latest/)

## Getting started:

Currently the FEniCSUI is available for ubuntu users. Windows users can use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (WSL) to run the code in the windows environment. The following installation instructions are based on Ubuntu 18 or WSL 1.

### 1. Docker:

An easy way to run  FEniCS is to use prebuilt, high-performance FEniCS Docker images. This way, users avoid tricky task of building and installing FEniCS libraries, and always have access to the best optimized build from FEniCS team. However, Docker is required to be installed and running on the system. Below a brief description of how to install docker. For a comprehensive guide for installing docker in different systems, please refer to [docker installation documentations](https://docs.docker.com/get-docker/) .

If you are using WSL services, [here](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly) is a detailed guide on how to use windows docker inside wsl 1.

If you already have docker installed and running, skip to the [**step 2**](#2. gmsh:)!

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



### 2. gmsh:

FEniCSUI uses gmsh to mesh the uploaded geometry (Step format supported). [pygmsh](https://pypi.org/project/pygmsh/) is used to call gmsh commands from web server backend, however, it requires the C++ libraries of gmsh to be installed on the system. The current mesh converters are based on gmsh version 3.0.6, which can be installed on ubuntu 18.04 by:

```bash
sudo apt-get install -y gmsh=3.0.6+dfsg1-1
```

For further detail on how to install specific version of gmsh, please refer to [gmsh installation guide](https://gmsh.info/).

### 3. python environment and dependencies:

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

For guidance on user interface, please refer to the [documentations](https://fenicsui.readthedocs.io/en/latest/#User-interface-walk-through:).

## Contributions:

FEniCSUI is under development, and we are more than happy to have more people contributing. If you are interested, please do not hesitate to get in touch.