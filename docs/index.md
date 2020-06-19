# FEniCSUI documentation

FEniCSUI is a library to build powerful user interfaces for FEniCS solvers. It provides a web interface consist of a 3D interactive CAD viewer to view and examine the geometry and a working tree to  provide the parameters necessary for running the solver.

## Quick start:

FEniCSUI is based on python 3, docker, and gmsh, all of which are available for Windows/Mac/ Windows systems, so theoretically, it is compatible with all operating systems given that the required version of the prerequisite libraries are installed. However, the following instructions are tested for Ubuntu 18.

Windows users can use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (WSL) to run the code in the windows environment. 

### 1. Docker:

The solver uses the docker image of FEniCS project to run the finite element code. This requires the docker to be installed and running in your system. 

If you are using WSL services, [here](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly) is a comprehensive guide on how to use windows docker inside WSL 1.

If you have already had docker installed and running, skip to the **step 2**!

To install docker on Ubuntu run the following commands in the terminal:

```bash
$ sudo apt-get update
$ sudo apt install docker.io
$ pip install --user docker-compose
```

and start the docker using system control:

```bash
$ sudo systemctl start docker
$ sudo systemctl enable docker
```

**OR** services:

```bash
$ sudo service docker start
```



You can make sure that the docker is up and running by:

```bash
$ docker info
# this shoud give you information about docker deamon

$ docker-compose --version
# you should get back your docker compose version
```

For instructions on installing docker for other operating systems, please refer to the [docker's official documentations](https://www.docker.com/get-started)

### 2. gmsh:

gmsh is a powerful library to generate mesh suitable for finite element analysis. FEniCSUI use [pygmsh](https://pypi.org/project/pygmsh/) to call gmsh commands from web server backend, however, it requires gmsh to be installed on the system. FEniCSUI currently supports gmsh 3.0.6 which is the default installation on ubuntu 18.04 LTS.

install the gmsh using the following command:

```bash
$ sudo apt-get install -y gmsh
```

For installation on other operating systems, please refer to the [Gmsh's official documentations](https://gmsh.info/). A list of binaries of all versions are available from [here](https://gmsh.info/bin/).

### 3. python environment and dependencies

Clone the FEniCSUI repository to a local directory:

```bash
$ git clone https://github.com/nasserarbabi/FEniCSUI.git
```

** If you do not have git on your system, install it via `sudo apt install git`. For other operating systems visit [this link](https://git-scm.com/download/).

Go to the main directory:

```bash
$ cd FEniCSUI
```

Create and activate new virtual environment::

```bash
$ virtualenv venv
$ source venv/bin/activate
```

** If you do not have virtualenv, you can install it by `pip install virtualenv`

Then, install dependencies using:

```bash
$ pip install -r requirements.txt
```

Since this is the first time that the app is installed, the database for the Django backend should be initialized. To do this, please go to the `FEniCSUI/FEniCSUI` directory, and run the following commands on terminal:

```bash
$ cd FEniCSUI
$ python manage.py makemigrations
$ python3 manage.py migrate
```

Once the database is initialized, you can run the application server by:

```bash
$ python manage.py runserver
```

Go to `localhost:8000` in your web browser. 

## Demo user interface walk through:

The FEniCSUI library contains one demo example of a user interface built to solve 2D Navier-Stokes equations using mixed element formulation based on section 3.4 of FEniCS [tutorial book](https://fenicsproject.org/pub/tutorial/html/._ftut1009.html#ftut1:NS), vol 1. You can use the solver on any desired surface geometry, however, the following section shows how to use user interface to solve "Test problem 2: Flow past a cylinder" in the FEniCS tutorial book, using the same geometry.

Once the server is up, you should be able to go to FEniCSUI dashboard by typing `localhost:8000` in your web browser. Here you can create, view and delete your projects. Your work in each project is automatically saved on the database.

Add a new project, give it a name and short description. Once the project is created, click on the project name, and hit the "Go to the project" button.

The user interface is consist of 3 sections: 1) a side bar to upload the geometry, generate mesh and enter the parameters required for the solver, 2) a 3D visualizer to view the geometry and mesh, and to select the boundary conditions, 3) viewer control buttons to access different view angles, activate select faces and edges or change the background color! The sidebar has 2 sections, on tree menu that expands if you click on the name of the section, and an arrow to the right which opens up the corresponding form to each of the menu items. 

If you have already uploaded the geometry, it should appear in the CAD viewer, otherwise, the first step is to upload a .step file defining the geometry. Currently, FEniCSUI only supports surface geometries (2D and 3D), volume support will be added in the future updates. A demo step file named "navierStokesFlowOverCylinder.step" can be found under "demoStepFiles" folder at the main directory folder. You can use this file to proceed with this tutorial.



The first step is to upload the geometry to the server.

## Table of Contents:

- [Tutorial](tutorial.md)
- [Solvers](solvers.md)
- [Back-end API Guide](backendAPI.md)
- [Front-end API Guide](frontEndAPI.md)
- [About](about.md)