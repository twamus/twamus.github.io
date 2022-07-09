<?php
setlocale(LC_MONETARY, 'en_US');
echo <<<EOT
<form method='post' enctype="multipart/form-data">
<input type='file' name='fn'>
<input type='submit'>
</form>
EOT;
if(isset($_FILES['fn'])){
$s=$_FILES["fn"]["tmp_name"];
echo "<pre><div style='width:1000px;border:1px solid black;'><div style='text-align:center;'><br>";
$i=imagecreatefrompng($s);
$lx=imagesx($i);
$ly=imagesy($i);
$fw=($lx*(5/16))." x ".($ly*(3/8));
$fh=($lx*(5/16))." x ".($ly*(5/16));
$tm=0;$tn=0;$t=0;
$a=array();$b=array();
echo imagesx($i)." x ".imagesy($i)."</div>";
$w=imagecolorsforindex($i,imagecolorat($i,0,0));
$q=$w['red'].",".$w['green'].",".$w['blue'];
for($y=0;$y<$ly;$y++){
	for($x=0;$x<$lx;$x++){
		$j=imagecolorat($i,$x,$y);
		$k=imagecolorsforindex($i,$j);
		$z=$k['red'].",".$k['green'].",".$k['blue'];
		if($k['alpha']>0){
			if(isset($b[$z])){$b[$z]++;}
			else{$b[$z]=1;}
		}
		elseif($z==$q){
			if(isset($b[$z])){$b[$z]++;}
			else{$b[$z]=1;}
		}
		else{
			if(isset($a[$z])){$a[$z]++;}
			else{$a[$z]=1;}
		}
		echo "<div style='border:1px solid black;width:5px;height:5px;background-color:rgb($z);display:inline;'> &nbsp;</div>";
	}
	echo "<br>";
}
echo "<table width='100%' border='1' cellspacing='0' cellpadding='10'><tr><th>Clr</th><th> # Blocks</th><th>$ 1x1</th><th>$ 1x2</th></tr>";
foreach($a as $k=>$v){
$t+=$v;
$n=number_format($v*0.15,2,'.',',');$tn+=$v*0.15;
$m=number_format($v*0.10,2,'.',',');$tm+=$v*0.10;
echo <<<EOT
<tr>
<td style='border:1px solid black;background-color:rgb($k);width:25px;'> &nbsp; </td>
<th>$v</th>
<td>$$m</td>
<td>$$n</td>
</tr>
EOT;
}
echo "<tr><th></th><th>$t</th><th>$tm </th><th>$tn</th></tr><tr><th colspan=4>$fw Lego Tall<br>$fh Lego Flat</th></tr>";
echo "<tr><th></th><th>".($lx*$ly)." w/bg</th><th>".($lx*$ly)*0.038."<th colspan=1>".($lx*0.5)."\" x ".($ly*0.5)."\" 1/2\"<br>".($lx*.375)."\" x ".($ly*.375)."\" 3/8\"</th></tr>";
echo "</table></div>";
}
?>
