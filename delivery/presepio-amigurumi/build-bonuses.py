from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
root=Path(__file__).resolve().parents[2]
out=root/'dist/downloads/presepio-amigurumi'
fonts=Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('Body',str(fonts/'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('Bold',str(fonts/'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFont(TTFont('Serif',str(fonts/'DejaVuSerif.ttf')))
W,H=A4; green=HexColor('#173d32');wine=HexColor('#8d2437');gold=HexColor('#d8ab50');ink=HexColor('#23352e');muted=HexColor('#68736c');cream=HexColor('#fffaf0');line=HexColor('#ded8ca')
body=ParagraphStyle('b',fontName='Body',fontSize=10,leading=16,textColor=ink,spaceAfter=9)
small=ParagraphStyle('s',parent=body,fontSize=8,leading=12)
cell=ParagraphStyle('c',parent=body,fontSize=8.4,leading=12)
head=ParagraphStyle('h',fontName='Serif',fontSize=25,leading=32,textColor=green)

def para(c,text,x,y,width=W-100,style=body):
 p=Paragraph(text,style);_,height=p.wrap(width,800);p.drawOn(c,x,y-height);return y-height-10

def page(c,n,title):
 c.setFillColor(cream);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(wine);c.setFont('Bold',8);c.drawString(50,H-43,'MEU PRESÉPIO ENCANTADO  /  GUIA BÔNUS')
 c.setStrokeColor(line);c.line(50,47,W-50,47);c.setFont('Body',8);c.setFillColor(muted);c.drawString(50,31,'Natal Feito à Mão  •  Material de apoio');c.drawRightString(W-50,31,str(n))
 return para(c,title,50,H-70,style=head)-10

def cover(c,k,title,sub,number):
 c.setFillColor(green);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setStrokeColor(gold);c.setLineWidth(1);c.rect(28,28,W-56,H-56,fill=0,stroke=1)
 c.setFillColor(gold);c.setFont('Bold',11);c.drawString(55,H-95,'MEU PRESÉPIO ENCANTADO')
 c.setFont('Body',9);c.drawString(55,H-122,'BÔNUS '+number+'  •  INCLUÍDO NA COLEÇÃO')
 # Code-native crochet-inspired circular motif.
 for radius in [53,71,89]:
  c.setStrokeColor(Color(.85,.67,.31,alpha=.5));c.circle(W-126,176,radius,fill=0,stroke=1)
 st=ParagraphStyle('cv',fontName='Serif',fontSize=43,leading=51,textColor=cream)
 para(c,title,55,H-226,W-110,st)
 st2=ParagraphStyle('cv2',fontName='Body',fontSize=12,leading=20,textColor=HexColor('#dce7de'))
 para(c,sub,55,H-430,W-120,st2)
 c.setFillColor(gold);c.setFont('Bold',10);c.drawString(55,83,'NATAL FEITO À MÃO')
 c.showPage()

def table(c,rows,y,widths):
 data=[[Paragraph(str(t),cell) for t in row] for row in rows]
 t=Table(data,colWidths=widths,hAlign='LEFT');t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),HexColor('#e9e2d3')),('LINEBELOW',(0,0),(-1,-1),.5,line),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]));_,h=t.wrap(W-100,800);assert y-h>65,(y,h);t.drawOn(c,50,y-h);return y-h-20

p=out/'bonus-guia-materiais-e-cores.pdf';c=canvas.Canvas(str(p),pagesize=A4);c.setTitle('Guia de Materiais e Cores | Meu Presépio Encantado');c.setAuthor('Natal Feito à Mão')
cover(c,'materials','Do novelo<br/>à sua cena<br/>de Natal.','Lista de materiais, combinação de cores e organização para começar seu presépio em amigurumi.', '01')
y=page(c,2,'Separe tudo antes do primeiro ponto.')
y=para(c,'Use esta lista como apoio à coleção. Antes de comprar, leia as receitas dos personagens escolhidos: elas definem as quantidades, medidas, agulhas e acessórios de cada peça.',50,y)
y=table(c,[['Material','Como conferir'],['Fio de algodão','O conjunto de referência usa Scheepjes Catona ou fio semelhante. Mantenha a mesma espessura entre os personagens para preservar a proporção.'],['Agulha de crochê','Use a medida indicada na receita e ajuste à sua tensão. Faça uma pequena amostra antes de iniciar uma peça completa.'],['Enchimento para amigurumi','Separe fibra própria para enchimento e distribua em pequenas porções, seguindo a orientação de cada peça.'],['Agulha de tapeçaria, marcador e tesoura','Facilitam a marcação de carreiras, a montagem e o arremate. Deixe os itens juntos em um estojo.'],['Olhos e acessórios de acabamento','Confira tamanho e tipo no projeto. Algumas peças podem pedir arame, cola ou acessórios específicos. Não substitua sem avaliar a montagem.']],y,[150,W-250])
y=para(c,'<b>Importante:</b> as peças da coleção são decorativas. Peças pequenas, olhos e arames exigem cuidado. Mantenha fora do alcance de bebês e crianças pequenas.',50,y,style=small)
c.showPage()
y=page(c,3,'Uma paleta que mantém a coleção unida.')
y=para(c,'Escolha os tons antes de começar. Fotografe os novelos juntos em luz natural e confira se as cores conversam entre si. Não precisa comprar tudo de novo se você já tem fios adequados.',50,y)
y=table(c,[['Grupo','Cores para separar'],['Sagrada Família','Creme e branco, rosa suave, azul, castanho para cabelos e detalhes dourados. Ajuste os tons de pele ao seu gosto.'],['Reis Magos','Tons de verde suave, azul claro, lavanda, coral, branco, castanho, preto e dourado para coroas e presentes.'],['Anjo e pastor','Branco, creme, castanho e dourado. Separe os fios de detalhes em porções identificadas.'],['Animais','Branco e creme para a ovelha; cinza para o burrinho; bege e castanho para o camelo; azul e rosa para as selas.']],y,[150,W-250])
y=para(c,'<b>Minha organização</b><br/>[ ] Conferi os materiais em cada receita.<br/>[ ] Separei os fios por personagem e identifiquei os tons.<br/>[ ] Anotei marca, cor e lote para possíveis reposições.<br/>[ ] Guardei pequenas sobras para costuras e detalhes.<br/>[ ] Deixei peças em andamento em saquinhos identificados.',50,y)
y=para(c,'As cores acima ajudam a planejar o visual. Não substituem as especificações e as instruções das receitas. Este guia não inclui novas receitas de amigurumi.',50,y,style=small)
c.save()
p=out/'bonus-planejador-do-presepio.pdf';c=canvas.Canvas(str(p),pagesize=A4);c.setTitle('Planejador do Presépio | Meu Presépio Encantado');c.setAuthor('Natal Feito à Mão')
cover(c,'plan','Um personagem<br/>de cada vez.<br/>Um Natal seu.','Planejador para organizar os 11 personagens, acompanhar as etapas e reservar tempo para os acabamentos.','02')
y=page(c,2,'Faça caber na sua rotina.')
y=para(c,'Escolha a data em que quer montar a cena e conte para trás. Reserve tempo para costura, acabamento e eventuais ajustes. A duração de cada personagem depende do seu ritmo e da experiência com amigurumi.',50,y)
y=table(c,[['Etapa','Seu plano'],['1. Escolher e preparar','Leia os PDFs. Confira materiais, cores e acessórios. Escolha o primeiro personagem e separe um lugar para guardar as peças.'],['2. Criar o centro da cena','Organize Maria, José e o Menino Jesus. Você pode começar pelo projeto com o qual se sentir mais confortável.'],['3. Completar o conjunto','Distribua anjo, pastor, três Reis Magos e os três animais entre os períodos disponíveis. Alterne peças conforme sua disposição.'],['4. Montar e revisar','Reserve uma etapa própria para unir partes, arrematar, conferir estabilidade e organizar os personagens na decoração.']],y,[150,W-250])
y=para(c,'<b>Meu compromisso possível</b><br/>Quero montar a cena em: ______ / ______ / ______<br/>Dias em que posso crochetar: _______________________________<br/>Tempo que consigo reservar: _______________________________<br/>Margem para acabamento e ajustes: _________________________',50,y)
y=para(c,'Não transforme o planejamento em uma corrida. Se precisar, ajuste a data ou monte a cena por etapas. Este guia não promete um prazo fixo para concluir a coleção.',50,y,style=small)
c.showPage()
y=page(c,3,'Marque cada conquista.')
y=para(c,'Imprima esta página ou use uma cópia para anotar suas etapas. Marque apenas quando a tarefa estiver concluída.',50,y)
rows=[['Personagem','Crochê','Montagem','Revisado']]
for name in ['Maria','José','Menino Jesus','Anjo','Rei Mago 1','Rei Mago 2','Rei Mago 3','Pastor','Ovelha','Burrinho','Camelo']: rows.append([name,'[  ]','[  ]','[  ]'])
y=table(c,rows,y,[W-328,76,76,76])
y=para(c,'<b>Antes de montar a cena</b><br/>[ ] Arremates conferidos e fios soltos retirados.<br/>[ ] Partes unidas e acessórios fixados conforme a receita.<br/>[ ] Peças posicionadas em uma superfície estável.<br/>[ ] Foto do conjunto pronto para guardar esse momento.',50,y)
c.save()
print('Created two bonus PDFs, three pages each.')
