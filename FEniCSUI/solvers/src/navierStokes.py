import fenics as fn
import json
from .statusTools import statusUpdate, sendFile
import sys

#  use log to print data to docker logs, this will show up in logging area in the front end
def log(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs, flush=True)

def navierStokes(projectId, mesh, faceSets, boundarySets, config):

    log("Navier Stokes Analysis has started")
    

    # this is the default directory, when user request for download all files in this directory is being compressed and sent to the user
    resultDir = "./Results/" 
    
    if len(config["steps"]) > 1:
        return "more than 1 step is not supported yet"

    # config is a dictionary containing all the user inputs for solver configurations
    t_init = 0.0
    t_final = float(config['steps'][0]["finalTime"])
    t_num = int(config['steps'][0]["iterationNo"])
    dt = ((t_final - t_init)/t_num)
    t = t_init

    #
    #  Viscosity coefficient.
    #
    nu = float(config['materials'][0]["viscosity"])
    rho = float(config['materials'][0]["density"])

    #
    #  Declare Finite Element Spaces
    # do not use triangle directly
    P2 = fn.VectorElement("P", mesh.ufl_cell(), 2)
    P1 = fn.FiniteElement("P", mesh.ufl_cell(), 1)
    TH = fn.MixedElement([P2, P1])
    V = fn.VectorFunctionSpace(mesh, "P", 2)
    Q = fn.FunctionSpace(mesh, "P", 1)
    W = fn.FunctionSpace(mesh, TH)

    #
    #  Declare Finite Element Functions
    #
    (u, p) = fn.TrialFunctions(W)
    (v, q) = fn.TestFunctions(W)
    w = fn.Function(W)
    u0 = fn.Function(V)
    p0 = fn.Function(Q)

    #
    # Macros needed for weak formulation.
    #
    def contract(u, v):
        return fn.inner(fn.nabla_grad(u), fn.nabla_grad(v))

    def b(u, v, w):
        return 0.5*(fn.inner(fn.dot(u, fn.nabla_grad(v)), w)-fn.inner(fn.dot(u, fn.nabla_grad(w)), v))

    # Define boundaries
    bcs = []
    for BC in config['BCs']:
        if BC["boundaryType"] == "wall":
            for edge in json.loads(BC["edges"]):
                bcs.append(fn.DirichletBC(W.sub(0), fn.Constant(
                    (0.0, 0.0, 0.0)), boundarySets, int(edge), method='topological'))
        if BC["boundaryType"] == "inlet":
            vel = json.loads(BC['value'])
            for edge in json.loads(BC["edges"]):
                bcs.append(fn.DirichletBC(W.sub(0), fn.Expression(
                    (str(vel[0]), str(vel[1]), str(vel[2])), degree=2), boundarySets, int(edge), method='topological'))
        if BC["boundaryType"] == "outlet":
            for edge in json.loads(BC["edges"]):
                bcs.append(fn.DirichletBC(W.sub(1), fn.Constant(
                    float(BC['value'])), boundarySets, int(edge), method='topological'))


    f = fn.Constant((0.0, 0.0, 0.0))
    #  weak form NSE
    NSE = (1.0/dt)*fn.inner(u, v)*fn.dx + b(u0, u, v)*fn.dx + nu * \
        contract(u, v)*fn.dx - fn.div(v)*p*fn.dx + q*fn.div(u)*fn.dx
    LNSE = fn.inner(f, v)*fn.dx + (1./dt)*fn.inner(u0, v)*fn.dx

    velocity_file = fn.XDMFFile(resultDir+"/vel.xdmf")
    pressure_file = fn.XDMFFile(resultDir+"/pressure.xdmf")
    velocity_file.parameters["flush_output"] = True
    velocity_file.parameters["functions_share_mesh"] = True
    pressure_file.parameters["flush_output"] = True
    pressure_file.parameters["functions_share_mesh"] = True
    #
    # code for projecting a boundary condition into a file for visualization
    #
    # for bc in bcs:
    #     bc.apply(w.vector())
    # fn.File("para_plotting/bc.pvd") << w.sub(0)

    for jj in range(0, t_num):
        t = t + dt
        # print('t = ' + str(t))
        A, b = fn.assemble_system(NSE, LNSE, bcs)
        fn.solve(A, w.vector(), b)
        # fn.solve(NSE==LNSE,w,bcs)
        fn.assign(u0, w.sub(0))
        fn.assign(p0, w.sub(1))
        # Save Solutions to Paraview File
        if (jj % 20 == 0):
            velocity_file.write(u0, t)
            pressure_file.write(p0, t)
            sendFile(projectId, resultDir+"vel.xdmf")
            sendFile(projectId, resultDir+"vel.h5")
            sendFile(projectId, resultDir+"pressure.xdmf")
            sendFile(projectId, resultDir+"pressure.h5")
            statusUpdate(projectId, "STARTED", {"progress":jj/t_num*100})

if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.realpath('.'))
    from mesh2Fenics import meshReader
    from testData import config, mesh
    projectId = '0f4abb38-9a1d-48bc-9737-cf2ade4d8373'
    config = config()
    mesh = json.loads(mesh())
    meshSets = meshReader(mesh)
    navierStokes(projectId, meshSets["feMesh"],
                 meshSets['faceSets'], meshSets['edgeSets'], config)
