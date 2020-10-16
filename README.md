# Descripción general

Este es un proyecto desarrollado como prueba para la empresa Kapta que se desarrolló utilizando el framework Angular con elementos gráficos de Material Design. Consiste básicamente en una plataforma web que permite econsultar el listado de pokemones del API Pokeapi y filtrar la consulta por el nombre.

# Instrucciones

Para poder correr este proyecto en un navegador local es necesario seguir los siguientes pasos:

* Clonar el proyecto
* Generar las dependencias corriendo el comando npm install sobre la raíz del proyecto
* Ejecutar el comando ng serve que despliega la aplicación 
* Abrir el navegador en localhost:4200

# Queries

Las queries requeridas se presentan a continuación:

* Definir un query que cree una tabla que permita relacionar un Pokémon con su(s) habilidades. 

`CREATE TABLE pokemon_habilidades (idPokemon, nombrePokemon, idHabilidad, nombreHabilidad);`

* Teniendo en cuenta la tabla creada en el punto anterior, escribe un query que muestre las diez habilidades más comunes listadas en orden alfabético

`SELECT nombreHabilidad, COUNT (nombreHabilidad) as numRepeticiones FROM pokemon_habilidades GROUP BY nombreHabilidad ORDER BY numRepeticiones LIMIT 10;`

* Usando la misma tabla, escribir un query que muestre únicamente los nombres de los Pokémon que tengan habilidades donde su nombre en español comience por ‘p’

`SELECT nombrePokemon FROM pokemon_habilidades INNER JOIN (SELECT id FROM abilities WHERE LEFT (es_name, 1) == 'p') as abilitiesQuery WHERE pokemon_habilidades.idHabilidad == abilitiesQuery.id`

# Vista previa

Se presentan a continuación algunos pantallazos que muestran la parte gráfica de la aplicación:

![image info](./pictures/1.png)
![image info](./pictures/2.png)
![image info](./pictures/3.png)
![image info](./pictures/4.png)

