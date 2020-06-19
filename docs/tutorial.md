# Tutorial: Building a web based user interface for 2D Navier-Stokes solver using FEniCSUI:

In this tutorial, we will go through the process of designing a web-based user interface for 2D Navier-Stokes solver in FEniCS using FEniCSUI library. The whole process including designing the front-end to build required menus, and tweaking the solver to accept the geometry, and the boundary condition are explained in detail. If you have not used FEniCSUI as user, I highly recommend to go through the [quick-start](https://fenicsui.readthedocs.io/en/latest/#quick-start) part of the documentation before trying to build the user interfaces.

## What is FEniCS?

According to the [FEniCS website](https://fenicsproject.org/), "FEniCS is a popular open-source ([LGPLv3](https://www.gnu.org/licenses/lgpl-3.0.en.html)) computing platform for solving partial differential equations (PDEs). FEniCS enables users to quickly translate scientific models into efficient finite element code. With the high-level Python and C++ interfaces to FEniCS, it is easy to get started, but FEniCS offers also powerful capabilities for more experienced programmers. FEniCS runs on a multitude of platforms ranging from laptops to high-performance clusters". The library enables scientists and engineers to develop high performance, yet easy to write code to solve finite element problems.

## Why FEniCSUI?

FEniCS has simplified the process of creating solvers for different types of Partial Differential Equations (PDEs) by providing high-level coding interfaces in python and C++. However, all the interactions with the library are through a programming interface, which requires users to have programming experience. On the other hand, even though creating simple geometries is just a couple of lines of code, complex geometries are usually built by third-party meshing libraries such as [gmsh](https://gmsh.info/), and imported into FEniCS. Defining boundary conditions on complex geometries can be cumbersome and confusing. 

Lacking graphical user interface makes it difficult for the developers to disseminate their solvers to a broader audience including those who do not have time or required experience for coding such as engineers in industries or university students. On the other hand, creating user interfaces are time-consuming, and usually involves programming knowledge in languages such as JavaScript, which people in the FEniCS community might not be comfortable with.

FEniCSUI is a library for creating web-based simple user interfaces for FEniCS solvers without the need to write JavaScript code. It also comes with integrated meshing tools based on gmsh that allows users to upload any geometry file (in step format). FEniCSUI automatically generates mesh and converts it into FEniCS readable format available to solvers. All the facets of the geometry are preserved and can be used to easily define different kinds of boundary conditions.

## Installation:

Here we are going briefly through installation steps for Linux systems. A detailed guide for installation can be found in FEniCSUI [documentations](https://fenicsui.readthedocs.io/en/latest/). If you have already installed FEniCSUI, you can skip to the [next part](#Configuring the FEniCS solver:). 

First of all, make sure you have Docker installed and running in your system. FEniCSUI requires docker to run FEniCS code. 

Install docker:

```bash
$ sudo apt-get update
$ sudo apt install docker.io
$ pip install --user docker-compose
```

and depending on your Linux system, start the docker using system control:

```bash
$ sudo systemctl start docker
$ sudo systemctl enable docker
```

**OR** services:

```bash
$ sudo service docker start
```

Install gmsh version 3.0.6. This can be done either by building gmsh from source, or just run the following command if you are using ubuntu 18.0.

```bash
$ sudo apt-get install -y gmsh
```

Clone the repository:

```bash
$ git clone https://github.com/nasserarbabi/FEniCSUI.git
```

Go to the main directory:

```bash
$ cd FEniCSUI
```

Create and activate a new virtual environment:

```bash
$ virtualenv venv
$ source venv/bin/activate
```

Initialize database:

```bash
$ cd FEniCSUI
$ python manage.py makemigrations
$ python3 manage.py migrate
```

Now, FEniCSUI is installed and ready to create and integrate user interfaces to the solver.

## Directory structure:

Before delving into the details of creating user interfaces, and configuring solver, it could be helpful to take a look at the important sections of FEniCSUI's directory structure. FEniCSUI is consist of two major components, the server backend, and front-end user interface. The backend is built using Django, a Python-based free and open-source web framework designed for fast web application development. Django handles the requests, run functions to get the geometry, mesh, store solver configurations and running and managing solvers. The front-end is based on ReactJs, an open-source JavaScript library for building user interfaces.  The structure below shows main components, including Django apps, and React file containers. 

```
FEniCSUI/
┣ AnalysesHub/			<- Component for configuring analyses and managing solvers
┣ FEniCSUI/				<- Main Django server settings	
┣ MeshGenerator/		<- Component for generating and managing mesh
┃ ┗ mesher.py			<- library to interact with gmsh
┣ dashboard/			<- Component for creating and managing projects
┣ frontend/				
┃ ┗ src/
┃   ┗ components/		<- Contains JavaScript codes for web interface
┣ media/				<- Folder for saving project files and results
┣ solvers/	
┃ ┣ Results/			<- Folder to keep the temporary results while the solver is running
┃ ┣ src/
┃ ┃ ┣ navierStokes.py	<- Solver code for Navier-Stokes problem, This tutorial
┃ ┃ ┗ statusTools.py	<- Helper code to update solver status
┃ ┣ mesh2Fenics.py		<- Librar to convert gmsh to Fenics, and define facets
┃ ┗ solverHub.py		<- Library to retrieve mesh and configuration, and call the solver
┗ config.yml			<- YAML file to configure user interface
```

The structure above might look complicated, but all we need to do is to modify`config.yml` to define parameters for user interface, and provide a FEniCS  solver code,`navierStokes.py` for this tutorial, inside `solvers/src/` folder . We also need to modify `solverHub.py` to include the solver we have added to `src` folder. In the following, we are going to go through the details of these files, and learn how to create or modify them to build a web based user interface for solving the Navier-Stokes problem.

## Configuring the FEniCS solver:

For this tutorial, we are going to write a FEniCS code to solve the Navier-Stokes problem on a 2D surface geometry. The solver is based on Taylor-Hood mixed elements, and the geometry and boundary conditions, and solver parameters are defined using FEniCSUI library.



## Building user interface:

