# Front end constructor

FEniCSUI uses a `yaml` file, `config.yml`, to construct the front end menus. YAML is a human friendly data serialization standard that provides a convenient way of creating system configurations. This document describes the structure of `config.yml` file, and how to use it to build customized user interfaces in FEniCSUI. For a comprehensive example please refer to the [tutorial](tutorial.md).

## icons:

FEniCSUI uses [font awesome free solid icons](https://fontawesome.com/icons?d=gallery&s=solid&m=free) to generate menu icons. To use the icons, simply search for icon in the website, choose your preferred icon and embed it to your user interface by including the name of the icon in `config.yml` file.

The icon name should be **modified** before inserting in the `config.yml` file:

- add `fa` in the beginning of the name
- convert the first letter of each section of the name to upper case
- remove any `-` in the name

Example: convert  `th-large` to `faThLarge`

## conventions: 

- use `[]` to indicate an empty list
- do not include entries with `null` values
- use `ture` and `false` to set Boolean fields
- convert icon names before including to `config.yml`: `th-large`  &#8594;   `faThLarge` 



## Available options:

Here is a list of all available options in `config.yml` file. The mandatory fields are marked with `**` in the description. The fields without `**` that are not needed in the menu construction can be removed.

``` yaml
solver: # ** name of the solver. A python file with the same exact name must be in sovers/src
	navierStokes # ** <string> example entry3
config: # ** <list> the configuration used to render menus
	menu: # ** <list> a list of menus showed in the side bar
		label: # ** <string> the label of the menu
		icon: # ** <string> a fontawesome icon
		form: # ** <list> a list of inputs to create side bar forms
			# use "-" to start a new input
			-	id: # ** <string> am id to identify the input. A database entry with this name will be created upon form submission
				
                type: # ** <string> defines the type of the input, options: input, select
                label: # <string> the label of the input
                placeholder: # <string> defines a place holder text for the input
                helperText: # <string> a descriptive small text below input
                default: # <string> the default value, should be the value of the option in case of select menu
                validation: # <list> a list of validation options used to validate the form before submission
                	characterLength: # <number> the acceptable character length
                	requred: # <boolean> if the field required to be filled
                	minValue: # <float> minimum acceptable value
                	maxValue: # <float> maximum acceptable value
                	
                invalidFeedback: # <string> a message to show if the form is invalid
                formOptions: # <list> a list of options if type is select, set to [] if the options are coming from database
                    - 	label: # <string> label of the input
                    	value: # <float> or <string> the value corresponding to the option
                optionsFrom: # <menu name> used when options depend on user previous inputs stored in the database. enter the name of the existing menu where the options are coming from
                fieldChange: # <list> options used to change other inputs based on user input. 
                	-	selectedField: # <string> the value of the option that changes other fields upon selection
                		targetId: # <string> the id of the target field
                		changingFields: # <list> or <string> list of the properties of the target field that should be changed. Should be set to "hide", if intended to hide the target
                			- property 1
                			- property 2
                		changeTo: # <list> a list with the same size and order of "changingFields" to set new values. do not include this if "changingFields: hide"
                        
		formButtons: # ** <list> a list for configuring submit button in the form
			id: # ** <string> id identifying the button, the convention is submit-menuName
			label: # ** <string> the label of the button
			type: # <string> Bootstrap button type, default: "primary", options: "primary", "secondary", "success", "info", "danger", "warning", "ligth", "dark"
```

