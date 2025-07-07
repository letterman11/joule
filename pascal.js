
x = 1;
a = Array ([x],[x,x]);
N = process.argv[2];
var out = ""
//N = parseInt(process.argv[2]);

console.log (process.argv[2]);

for (let i = 2; i < N; i++)
{
	T = Array();
    T.push( a[0][0] ) 

	for(let j=1; j < i; j++)
	{
		T.push(a[i-1][j-1] + a[i-1][j]);
	}

	T.push(a[0][0])
	a.push(T);
}


function print_pas(ar)
{
	for (var s=0; s < ar.length; s++)
	{
		line = ar[s];
		for (var ss=0; ss < line.length; ss++)
		{
		   out = out + " " + line[ss] 
		}
		console.log(s+1, " ", out);	
		out=""
	}
}

print_pas(a);
