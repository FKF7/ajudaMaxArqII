class Formula {
    constructor(ret, pode, vars, form, used) {
        this.retorno = ret;
        this.podeUsar = pode;
        this.varsNecessarias = vars;
        this.formato = form;
        this.usada = used;
    }
}

class Indice {
    constructor(indice, nome) {
        this.indice = indice;
        this.nome = nome;
    }
}

class Variavel {
    constructor(tem, valor, nome) {
        this.conhecida = tem;
        this.valor = valor;
        this.nome = nome;
    }
}

var show = false;

var vars = [
    new Variavel(false, null, "Número de Blocos da Cache"),   //00
	new Variavel(false, null, "Tamanho do Conjunto"),      //01
	new Variavel(false, null, "Número de Blocos do Conjunto"),//02
	new Variavel(false, null, "Tamanho do Bloco"),         //03
	new Variavel(false, null, "Tamanho da Cache"),         //04
	new Variavel(false, null, "Número de Conjuntos"),     //05
	new Variavel(false, null, "Bloco da Cache"),       //06
	new Variavel(false, null, "Bloco da RAM"),         //07
	new Variavel(false, null, "Bits Índice"),       //08
	new Variavel(false, null, "Bits Offset"),       //09
	new Variavel(false, null, "Bits Tag"),          //10
	new Variavel(false, null, "Bits Endereço"),        //11
]
var mapeamento;

var vars0 = ["block", "none", "none", "block", "block", "none", "block", "block", "block", "block", "block", "block"]
var vars1 = ["none", "none", "none", "block", "none", "none", "none", "none", "none", "block", "block", "block"]
var vars2 = ["none", "block", "block", "block", "block", "block", "none", "none", "block", "block", "block", "block"]
var conhecida = [false, false, false, false, false, false, false, false, false, false, false, false]
const id = "var";
const id0 = "var0";

function changeInputs(value) {
    mapeamento = value;
    var state;

    if (!show) {
        showSelecaoVariaveis();
    }
    
    
    document.getElementById("temVariaveis").style.display = 'block';
    document.getElementById("variaveisTem").style.display = 'block';
    document.getElementById("select").style.display = 'block';
    document.getElementById("calculo").style.display = 'block';

    reset();
    if (value == 1) {
        document.getElementById("temVariaveis").style.height = 'auto';
        document.getElementById("variaveisTem").style.height = '97px';
        state = vars1;
    } else {
        document.getElementById("temVariaveis").style.height = 'auto';
        document.getElementById("variaveisTem").style.height = '197px';
        if (value == 0) {
            state = vars0;
        } else {
            state = vars2;
        }
    }

    for (var i = 0; i < 12; i++) {
        if(i < 10) {
            document.getElementById(id0 + i).style.display = state[i];
            document.getElementById(id0 + i + "Sel").style.display = state[i];
        } else {
            document.getElementById(id + i).style.display = state[i];
            document.getElementById(id + i + "Sel").style.display = state[i];
        }
    }
}

function reset() {
    for (var i = 0; i < 12; i++) {
        if(i < 10) {
            document.getElementById(id0 + i + "Chck").checked = false;
            document.getElementById(id0 + i + "Box").style.display = "none";
        } else {
            document.getElementById(id + i + "Chck").checked = false;
            document.getElementById(id + i + "Box").style.display = "none";
        }
    }
    document.getElementById("select").value = "null";
}

function exibeCaixa(check) {
    idBox = (check.id).substr(0,5) + "Box";
    idSel = (check.id).substr(0,5) + "Sel";

    if (check.checked) {
        document.getElementById(idBox).style.display = 'block';
        document.getElementById(idSel).style.display = 'none';
    } else {
        document.getElementById(idBox).style.display = 'none';
        document.getElementById(idSel).style.display = 'block';
    }

    if ((check.id).substr(0,5) == getValueById("select")) {
        document.getElementById("select").value = "null";
    }
}

function calcular() {
    if (confereSeCalcula()) {
        document.getElementById("calculo").disabled = true;
        atualizaVetorVars();

        if (mapeamento == 0) {
            listaFormulas = listaFormulas0;
        } else if (mapeamento == 1) {
            listaFormulas = listaFormulas1;
        } else {
            listaFormulas = listaFormulas2;
        }

        numFormulas = listaFormulas.length;
        atualizaPodeUsar();
        var busca = getValueById("select");
        var indBusca = parseInt(busca.substr(3,2));
        var listaIndices = [new Indice(1, "s")];
        var ind = 0;
        var paraF = false;
        listaIndices.shift();
        
        var i = 0;
        var formulasExec;
        while (!vars[indBusca].conhecida) {
            formulasExec = 0;
            while (i < numFormulas & !paraF) {
                if(listaFormulas[i].podeUsar) {
                    ind = parseInt(listaFormulas[i].retorno.substr(3,2));
                    if (listaFormulas[i].varsNecessarias.length == 1) {
                        vars[ind].valor = f1(listaFormulas[i].formato, vars[parseInt(listaFormulas[i].varsNecessarias[0].substr(3,2))].valor);
                    } else if (listaFormulas[i].varsNecessarias.length == 2) {
                        vars[ind].valor = f2(listaFormulas[i].formato, vars[parseInt(listaFormulas[i].varsNecessarias[0].substr(3,2))].valor, vars[parseInt(listaFormulas[i].varsNecessarias[1].substr(3,2))].valor);
                    } else {
                        vars[ind].valor = f3(listaFormulas[i].formato, vars[parseInt(listaFormulas[i].varsNecessarias[0].substr(3,2))].valor, vars[parseInt(listaFormulas[i].varsNecessarias[1].substr(3,2))].valor, vars[parseInt(listaFormulas[i].varsNecessarias[2].substr(3,2))].valor);
                    }
                    vars[ind].conhecida = true;
                    atualizaPodeUsar();
                    formulasExec++;
                }
                i++;
            }
            if (formulasExec == 0) {
                paraF = true;
            } else {
                formulasExec = 0;
            }
            i = 0;
        }

        if (paraF) {
            alert("Não é possível descobrir sobre " + vars[indBusca].nome + " com os dados fornecidos");
        } else {
            showResultadoSimples(indBusca);
        }
        document.getElementById("novoCalculo").style.display = "block";
    }
}

function confereSeCalcula() {
    if (getValueById("select") == "null") {
        alert("Selecione um retorno antes de calcular!");
        return false;
    }
    
    for (var i = 0; i < 12; i++) {
        if (i < 10) {
            if (!(getHiddenById(id0 + i + "Box")) & getValueById(id0 + i + "Val") == "") {
                alert("Preencha todos os dados antes de calcular!");
                return false;
            }
        } else {
            if (!(getHiddenById(id + i + "Box")) & getValueById(id + i + "Val") == "") {
                alert("Preencha todos os dados antes de calcular!");
                return false;
            }
        }
    }

    for (var i = 0; i < 12; i++) {
        if (i < 10) {
            if (getCheckedById(id0 + i) == true) {
                return true;
            }
        } else {
            if (getCheckedById(id + i) == true) {
                return true;
            }
        }
    }

    alert("Selecione as variáveis que você conhece o valor!");
    return false;
}

//FÓRMULAS
listaFormulas0 = [
    new Formula("var00", false, ["var03", "var04"], 4, false),
    new Formula("var00", false, ["var08"], 0, false),
    new Formula("var03", false, ["var00", "var04"], 4, false),
    new Formula("var03", false, ["var09"], 0, false),
    new Formula("var04", false, ["var00", "var03"], 3, false),
    new Formula("var06", false, ["var00", "var07"], 2, false),
    new Formula("var08", false, ["var00"], 1, false),
    new Formula("var08", false, ["var09", "var10", "var11"], 7, false),
    new Formula("var09", false, ["var03"], 1, false),
    new Formula("var09", false, ["var08", "var10", "var11"], 7, false),
    new Formula("var10", false, ["var08", "var09", "var11"], 7, false),
    new Formula("var11", false, ["var08", "var09", "var10"], 6, false)
]

listaFormulas1 = [
    new Formula("var03", false, ["var09"], 0, false),
    new Formula("var09", false, ["var03"], 1, false),
    new Formula("var09", false, ["var10", "var11"], 9, false),
    new Formula("var10", false, ["var09", "var11"], 9, false),
    new Formula("var11", false, ["var09", "var10"], 8, false)
]

listaFormulas2 = [
    new Formula("var01", false, ["var02", "var03"], 3, false),
    new Formula("var01", false, ["var04", "var05"], 5, false),
    new Formula("var02", false, ["var01", "var03"], 5, false),
    new Formula("var03", false, ["var01", "var02"], 5, false),
    new Formula("var03", false, ["var09"], 0, false),
    new Formula("var04", false, ["var01", "var05"], 3, false),
    new Formula("var05", false, ["var01", "var04"], 4, false),
    new Formula("var05", false, ["var08"], 0, false),
    new Formula("var08", false, ["var05"], 1, false),
    new Formula("var08", false, ["var09", "var10", "var11"], 7, false),
    new Formula("var09", false, ["var03"], 1, false),
    new Formula("var09", false, ["var08", "var10", "var11"], 7, false),
    new Formula("var10", false, ["var08", "var09", "var11"], 7, false),
    new Formula("var11", false, ["var08", "var09", "var10"], 6, false)
]

/*
FORMATOS A = f(X, Y, Z)
0 -> A = 2^X
1 -> A = log2(X)
2 -> A = Y % X
3 -> A = X * Y
4 -> A = Y / X
5 -> A = X / Y
6 -> A = Z + X + Y
7 -> A = Z - X - Y
8 -> A = X + Y
9 -> A = Y - X
*/

function f1(f, x) {
    if (f == 0) {
        return 2**x;
    }
    if (f == 1) {
        return Math.log2(x);
    }
}

function f2(f, x, y) {
    if (f == 2) {
        return y % x;
    }
    if (f == 3) {
        return x * y;
    }
    if (f == 4) {
        return y / x;
    }
    if (f == 5) {
        return x / y;
    }
    if (f == 8) {
        return x + y;
    }
    if (f == 9) {
        return x - y;
    }
}

function f3(f, x, y, z) {
    if (f == 6) {
        return x + y + z;
    }
    if (f == 7) {
        return z - x - y;
    }
}

function getValueById(id) {
    return document.getElementById(id).value;
}

function getCheckedById(id) {
    return document.getElementById(id + "Chck").checked;
}

function getHiddenById(id) {
    if (document.getElementById(id).style.display == "none") {
        return true;
    } else {
        return false;
    }
}

function atualizaVetorVars() {
    for (var i = 0; i < 12; i++) {
        if (i < 10) {
            if (getCheckedById(id0 + i)) {
                vars[i].conhecida = true;
                vars[i].valor = parseInt(getValueById(id0 + i + "Val"));
            }
        } else {
            if (getCheckedById(id + i)) {
                vars[i].conhecida = true;
                vars[i].valor = parseInt(getValueById(id + i + "Val"));
            }
        }
    }
}

function atualizaPodeUsar() {
    var pode;
    for (var i = 0; i < numFormulas; i++) {
        pode = true;
        if (vars[parseInt(listaFormulas[i].retorno.substr(3,2))].conhecida) {
            pode = false;
        } else {
            for (var j = 0; j < listaFormulas[i].varsNecessarias.length; j++) {
                if (!(vars[parseInt(listaFormulas[i].varsNecessarias[j].substr(3,2))].conhecida)) {
                    pode = false;
                }
            }
        }
        listaFormulas[i].podeUsar = pode;
    }
}

function novoCalculo() {
    location.reload();
}

function showResultadoSimples(i) {
    var resultado = "<p><strong style='font-size: 18px;'>Resultado:</strong>";
    resultado += ("<br>" + vars[i].nome + " = " + vars[i].valor + "</p>");
	resultado += "<input type='button' value='Resultado Detalhado' onclick='showResultadoDetalhado()' id='buttonResultadoDetalhado'></input>";
    document.getElementById("resultadoSimples").innerHTML = resultado;
}

function showResultadoDetalhado() {
    var indBusca = parseInt(getValueById("select").substr(3,2));
    var resultado = "<p><strong style='font-size: 18px;'>Outros Dados Obtidos:</strong>";
    var dados = 0;

    for (var i = 0; i < 12; i++) {
        if (vars[i].conhecida & i != indBusca) {
            dados++;
            resultado += ("<br>" + vars[i].nome + " = " + vars[i].valor);
        }
    }
    if (dados == 0) {
        resultado += "Não há mais dados para exibição";
    }
    resultado += "</p>";
    document.getElementById("buttonResultadoDetalhado").style.display = "none";
    document.getElementById("resultadoDetalhado").innerHTML = resultado;
}

function showSelecaoVariaveis() {
    var temVariaveis = "<legend>Quais variáveis você tem informação?</legend>";
    var variaveisTem = "<legend>Qual o valor das variáveis?</legend>";
    var select = "<option value='null' id='selectDefault'>Selecione a variável Resultado</option>"

    for (var i = 0; i < 12; i++) {
        if (i < 10) {
            temVariaveis += "<div id='" + id0 + i + "'><input type='checkbox' class='varCheck' id='" + id0 + i + "Chck' onchange='exibeCaixa(this)'>";
            temVariaveis += "<label for='" + id0 + i + "Chck'>" + vars[i].nome + "</label></div>";

            variaveisTem += "<div hidden id='" + id0 + i + "Box'><input type='text' class='varText' id='" + id0 + i + "Val'>";
            variaveisTem += "<label for='" + id0 + i + "Val'>" + vars[i].nome + "</label></div>";

            select += "<option value='" + id0 + i + "' id='" + id0 + i + "Sel'>" + vars[i].nome + "</option>"
        } else {
            temVariaveis += "<div id='" + id + i + "'><input type='checkbox' class='varCheck' id='" + id + i + "Chck' onchange='exibeCaixa(this)'>";
            temVariaveis += "<label for='" + id + i + "Chck'>" + vars[i].nome + "</label></div>";

            variaveisTem += "<div hidden id='" + id + i + "Box'><input type='text' class='varText' id='" + id + i + "Val'>";
            variaveisTem += "<label for='" + id + i + "Val'>" + vars[i].nome + "</label></div>";

            select += "<option value='" + id + i + "' id='" + id + i + "Sel'>" + vars[i].nome + "</option>"
        }
    }

    document.getElementById("temVariaveis").innerHTML = temVariaveis;
    document.getElementById("variaveisTem").innerHTML = variaveisTem;
    document.getElementById("select").innerHTML = select;
    show = true;
}