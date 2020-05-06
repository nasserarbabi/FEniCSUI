# Dependencies:

These instructions are for Ubuntu.  

To run the development server, we first need to install the dependencies required to run the modules. There are two types of dependencies, python dependencies, and system dependencies. 

## python dependencies
to install python dependencies, first create a virtual invironment:  

`virtualenv venv`

then activate the environment by `source venv/bin/activate`

Once in the environment, install the pip dependencies by running:

`pip3 install -r requirements.txt`

## system dependencies
We use gmsh for meshing and require docker to run the fenics solvers. As these are not the python dependencies, they should be installed in the system separately.

gmsh: `sudo apt-get install -y gmsh=3.0.6+dfsg1-1`

if you already have docker installed, skip the following code, otherwise, install docker  
`sudo apt-get update`  
`sudo apt install docker.io`

and then start docker by:
`sudo systemctl start docker`

if you are using WSL in windows, [this link](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly) provides a detailed guideline on how to use windows docker from inside wsl.

