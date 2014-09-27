---
layout: post
title: JLex User Manual Translation (Japanese)
category: JLex
---

この記事は[JLex User Manual](https://www.cs.princeton.edu/~appel/modern/java/JLex/current/manual.html)の日本語翻訳です。誤訳などは [Pull Request](https://github.com/mahata/mahata.github.io) で指摘していただけると助かります。

## はじめに

字句解析器は入力文字をトークンに分割します。字句解析器を手で書くのは面倒なので、その作業を簡潔化するためのツールが開発されてきした。

その中でもよく知られているものは Lex でしょう。Lex は UNIX で動作する字句解析器の生成ツールです。Lex は字句解析の仕様が記述された、あるフォーマットにもとづいたファイルを読み込み、C言語の字句解析器を生成します。

JLex ユーティリティは Lex モデルを基礎にしています。JLex は Lex に似た仕様ファイルを読み込み、字句解析器に該当する Java のソースコードを出力します。

## JLex 仕様

JLex の入力ファイルは3つのセクションから成ります。それぞれのセクションは `%%` で区切られます。JLex の入力ファイルのフォーマットは次のとおりです。

```
ユーザーコード
%%
JLex ディレクティブ
%%
正規表現ルール
```

`%%` ディレクティブは行の先頭にある必要があります。`%%` ディレクティブから行末までの入力は無視されます。

最初のセクションであるユーザーコードの部分は出力ファイルにコピーされます。ここにはユーティリティクラスや、字句解析器が返すオブジェクトの型宣言などを書きます。

二番目は JLex ディレクティブのセクションです。ここにはマクロ定義や字句解析器が持つ状態の情報について書きます。

三番目のセクションには字句解析のルールを書きます。それぞれのルールは、状態リスト (オプション)、正規表現、それに対応するアクションの3つの要素から成ります。

### ユーザーコード

ユーザーコードは一番最初の `%%` ディレクティブより前に書きます。ユーザーコードは JLex の出力である字句解析器ファイルの先頭に逐語的にコピーされます。字句解析器ファイルにパッケージ宣言や外部クラスの読み込みなどを記述したければ、ユーザーコードにそれらを書くことで実現できます。

### JLex ディレクティブ

JLex ディレクティブのセクションは最初の `%%` の後から二番目の `%%` までです。 (ToDo)

#### 字句解析器クラスへ埋め込まれるコード

`%{...%}` ディレクティブに書かれた Java コードは字句解析器クラスにコピーされます。次のようにして使います。

```
%{ 
<code> 
%}
```

`%{` と `%}` はどちらも行の先頭に置かなければなりません。間に挟まれた `<code>` の部分が JLex の生成する字句解析器クラスにコピーされます。

```
class Yylex { 
... <code> ... 
}
```

これにより変数や関数の宣言を字句解析クラスに埋め込めます。生成される字句解析クラスと重複する可能性があるため、"yy" で始まる変数名は避けるべきです。

#### 字句解析クラスのための初期化コード

`%init{ ... %init}` ディレクティブに書かれた Java コードは字句解析器クラスのコンストラクタにコピーされます。

```
%init{ 
<code>
%init}
```

`%init{` と `%init}` は行頭に書きます。`<code>` の部分が字句解析器クラスのコンストラクタにコピーされます。

```
class Yylex { 
Yylex () { 
... <code> ... 
} 
}
```

このディレクティブを使い、字句解析器クラスのコンストラクタでの初期化が可能です。yy で始まる変数名は生成される字句解析器クラスのために予約されているので避けましょう。

`%init{ ... %init}` に置かれたコードは例外を投げる可能性があります。この例外を宣言するには `%initthrow{ ... $initthrow}` ディレクティブを使います。

```
%initthrow{ 
<exception[1]>[, <exception[2]>, ...]
%initthrow}
```

ここに書かれた Java コードは字句解析器のコンストラクタにコピーされます。

```
Yylex () 
throws <exception[1]>[, <exception[2]>, ...]
{ 
... <code> ... 
}
```

`%init{ ... %init}` に書かれた Java コードが宣言されていない例外を投げる場合、字句解析器のコンパイルに失敗する可能性があります。

#### 字句解析クラスの End-of-File コード

`%eof{ ... %eof}` ディレクティブに書いたコードは、字句解析クラスが end-of-file にたどり着いたときの処理に使われます。

```
%eof{ 
<code>
%eof}
```

`%eof{` と `%eof}` ディレクティブは行頭に書きます。`<code>` に書かれた Java コードは字句解析器が入力ファイルの end-of-file に到達するとすぐ、多くとも一度だけ実行されます。

`%eof{ ... %eof}` に置かれたコードは例外を投げる可能性があります。この例外を宣言するには `%eofthrow{ ... $eofthrow}` ディレクティブを使います。

```
%eofthrow{ 
<exception[1]>[, <exception[2]>, ...]
%eofthrow}
```

ここに書かれた Java コードは字句解析関数にコピーされ、end-of-file に到達したときの後始末のための処理をします。

```
private void yy_do_eof () 
throws <exception[1]>[, <exception[2]>, ...]
{ 
... <code> ... 
}
```

`<code>` に置かれる Java コードの一部は `%eof{ ... %eof}` に書かれたコードになります。このコードが `%eofthrow{ ... %eofthrow}` で宣言していない例外を投げるとき、字句解析器のコンパイルに失敗する可能性があります。

#### マクロ定義

Macro definitions are given in the JLex directives section of the specification. Each macro definition is contained on a single line and consists of a macro name followed by an equal sign (=), then by its associated definition. The format can therefore be summarized as follows.

マクロ定義は JLex ディレクティブのセクションに埋め込みます。それぞれのマクロ定義は一行で書かれ、マクロ名に続いてイコール(=)、そして定義の順番になります。フォーマットの例は次の通りです。

```
<name> = <definition>
```

空白文字やタブがイコールの前後に来ても問題ありません。それぞれのマクロ定義は一行で書きます。

マクロ名は英アルファベットか数字、もしくはアンダースコアの組み合わせです。英アルファベットかアンダースコアではじまる名前である必要があります。

マクロ定義は正規表現です。詳しくは後の章を参照してください。

マクロ定義の正規表現の中に、マクロが表れることもあります。これは関数でも非終端記号でもないことに注意しましょう。相互再帰的なマクロは許されません。マクロ定義が循環すると予期せぬ結果を引き起こす可能性があります。

#### 状態宣言

状態に応じて適用するべき正規表現を変えられます。状態は JLex ディレクティブの中で、次のように宣言します。

```
%state state[0][, state[1], state[2], ...]
```

一連の状態宣言は一行に収めます。状態の変遷が複数ある場合、それを複数行に分けて記述することは可能です。

状態名はIDとして正しいフォーマットである必要があります。つまり、英アルファベットかアンダースコアではじまり、英アルファベットか数字かアンダースコアのみで構成される名前です。

暗黙的に JLex によって宣言されている状態があります。`YYINITIAL` という名前で、構文解析器の初期状態となります。

構文解析はオプショナルな状態リストを持って始まります。状態リストが与えられると、字句解析器はある状態のルールにのみマッチします。状態リストが与えられない場合、字句解析器は状態に依らず全てのルールにマッチします。

JLex ファイルで状態の宣言をせず、状態リストをともなうルールを適用していない場合、構文解析器の状態は `YYINITIAL` のままです。字句解析ルールが状態リストと関連づいていないので、`YYINITIAL` を含む全ての状態向けのルールが適用されます。状態が全く使われていないであれば、字句解析器は期待通りに動きます。

状態は整数値の定数として生成された字句解析器で宣言されます。その定数名には宣言時の状態名が使われます。ユーザは状態名と字句解析器クラスのアクションで使われる変数名が衝突しないように注意しましょう。状態名を全て大文字で書く慣習があります。この慣習を採用することで、定数を見分けることが簡単になります。

#### 文字のカウント

文字数カウント機能はデフォルトではオフですが、`%char` ディレクティブを使ってオンにできます。

```
%char
```

文字数カウントは 0 からはじまり、`yychar` という整数型の変数に格納されます。

#### 行のカウント

行カウント機能はデフォルトではオフですが、 `%line` ディレクティブを使ってオンにできます。

```
%line
```

行カウントは 0 からはじまり、`yyline` という整数型の変数に格納されます。

#### Java CUP 互換性

Java CUP はジョージア工科大学の Scott Hudson に作られた Java の構文解析器生成系です。現在は Frank Flannery, Dan Wang, C. Scott Ananian にメンテナンスされています。詳しくはこちらのサイトを参照してください - http://www.cs.princeton.edu/~appel/modern/java/CUP/

Java CUP 互換機能はデフォルトではオフですが、次の JLex ディレクティブでオンにできます。

```
%cup
```

このディレクティブを使うと字句解析器は `java_cup.runtime.Scanner` インタフェースを実装します。これは次の3つのディレクティブと等価です:

```
%implements java_cup.runtime.Scanner
%function next_token
%type java_cup.runtime.Symbol
```

この3つのディレクティブについては次のセクションを参照してください。また、CUP のマニュアルにも CUP と JLex を同時に使う方法についての記述があります。

#### 字句解析器のコンポーネント名

次のディレクティブで字句解析器クラスの名前、トークナイズ関数、トークナイズ関数の返り値の型を変えられます。字句解析クラスの名前を `Yylex` から変更するには `%class` ディレクティブを使います。

```
%class <name>
```

トークナイズ関数の名前を `yylex` から変更するには `%function` ディレクティブを使います。

```
%function <name>
```

トークナイズ関数の返り値の型を `Yytoken` から変更するには `%type` ディレクティブを使います。

```
%type <name>
```

もしこれらのディレクティブによる変更がなければ、トークナイズ関数は `Yylex.yylex()` となり、この関数は `Ytoken` 型の値を返します。

スコープ内での名前の衝突を避けるため、 `yy` ではじまる名前は字句解析クラスの関数名や変数名に予約されます。

#### デフォルトのトークン型

32ビットのプリミティブな整数型をトークナイズ関数の返り値にする (すなわち、トークンクラスを整数型にする) ためには 、`%integer` ディレクティブを使います。

```
%integer
```

次のコード断片が示す通り、デフォルトでは `Ytoken` がトークナイズ関数 `Yylex.yylex()` の戻り値の型です。

```
class Yylex { ... 
public Yytoken yylex () {
... }
```

`%integer` ディレクティブで関数の宣言部を変えられます。トークンタイプが `int` になります。

```
class Yylex { ... 
public int yylex () {
... }
```

このディレクティブで字句解析アクションが整数値を返すようになります。次のコード断片は仮想的な字句解析アクションです。

```
{ ...
return 7; 
... }
```

整数の戻り値は end-of-file に対する挙動の変更をともないます。デフォルトでは、オブジェクト (`java.lang.Object` クラスのサブクラス) が `Yylex.yylex()` で返されます。`Yylex` が字句解析をするときは特別なオブジェクトが end-of-file のために予約されなければなりません。入力ファイルが end-of-file に到達すると `Yylex.yylex()` は `null` を返します。

`Yylex.yylex()` の返り値が整数型なら `null` が返ることはありません。代わりに `Yylex.yylex()` は `-1` を返します。この値は`Yylex.YYEOF` と等価です。`%integer` ディレクティブは `%yyeof` を含みます。詳しくは次を参照してください。

#### Dummy

(Work In Progress)

## Credits and Copyrights

### Credits

The treatment of lexical analyzer generators given in Alan Holub's Compiler Design in C (Prentice-Hall, 1990) provided a starting point for my implementation.

Discussions with Professor Andrew Appel of the Princeton University Computer Science Department provided guidance in the design of JLex.

Java is a trademark of Sun Microsystems Incorporated.

### Copyright

JLex COPYRIGHT NOTICE, LICENSE AND DISCLAIMER.

Copyright 1996 by Elliot Joel Berk.

Permission to use, copy, modify, and distribute this software and its documentation for any purpose and without fee is hereby granted, provided that the above copyright notice appear in all copies and that both the copyright notice and this permission notice and warranty disclaimer appear in supporting documentation, and that the name of Elliot Joel Berk not be used in advertising or publicity pertaining to distribution of the software without specific, written prior permission.

Elliot Joel Berk disclaims all warranties with regard to this software, including all implied warranties of merchantability and fitness. In no event shall Elliot Joel Berk be liable for any special, indirect or consequential damages or any damages whatsoever resulting from loss of use, data or profits, whether in an action of contract, negligence or other tortious action, arising out of or in connection with the use or performance of this software.