---
layout: post
title: JLex User Manual Translation (Japanese)
category: JLex
---

この記事は[JLex User Manual](https://www.cs.princeton.edu/~appel/modern/java/JLex/current/manual.html)の日本語翻訳です。誤訳などは [Pull Request](https://github.com/mahata/mahata.github.io) で指摘していただけると助かります。

## はじめに

字句解析器は入力文字のストリームをトークンに分割します。字句解析器を手で書くのは面倒なので、その作業を簡潔化するためのツールが開発されてきました。

中でも最もよく知られているものは Lex でしょう。Lex は UNIX で動作する字句解析器の生成ツールです。Lex は字句解析の仕様が記述された、あるフォーマットにもとづいたファイルを読み込み、C言語のテーブル駆動型の字句解析器を生成します。テーブルは字句解析のために使うデータ構造です。

JLex ユーティリティは Lex モデルを基礎にしています。JLex は Lex に似た仕様ファイルを読み込み、字句解析器として振る舞う Java のソースコードを出力します。

## JLex 仕様

JLex の入力ファイルは3つのセクションから成ります。それぞれのセクションは `%%` で区切られます。JLex の入力ファイルのフォーマットは次の通りです。

```
ユーザーコード
%%
JLex ディレクティブ
%%
正規表現ルール
```

`%%` ディレクティブは行の先頭にある必要があります。`%%` ディレクティブから行末までの入力は無視されます。

最初のセクションであるユーザーコードは出力ファイルにコピーされます。ここにはユーティリティクラスや、字句解析器が返すオブジェクトの型宣言などを書きます。

二番目は JLex ディレクティブのセクションです。ここにはマクロ定義や字句解析器が持つ状態名について宣言します。

三番目のセクションには字句解析のルールを書きます。それぞれのルールは、状態リスト (オプション)、正規表現、そして対応するアクションの3つの要素から成ります。

### ユーザーコード

ユーザーコードは一番最初の `%%` ディレクティブより前に書きます。ユーザーコードは JLex の出力である字句解析器ファイルの先頭に逐語的にコピーされます。字句解析器ファイルにパッケージ宣言や外部クラスの読み込みなどを記述したければ、ユーザーコードにそれらを書くことで実現できます。

### JLex ディレクティブ

JLex ディレクティブのセクションは最初の `%%` の後から二番目の `%%` までです。それぞれのディレクティブは行頭に置かれます。

#### 字句解析器クラスへ埋め込まれるコード

`%{...%}` ディレクティブに書かれた Java コードは字句解析器クラスにコピーされます。次のようにして使います。

```
%{
<code>
%}
```

`%{` と `%}` はどちらも行の先頭に置かなければなりません。`<code>` が JLex の生成する字句解析器クラスにコピーされます。

```
class Yylex {
... <code> ...
}
```

このディレクティブを使うことで変数や関数の宣言を字句解析クラスに埋め込むことができます。生成される字句解析クラスと重複する可能性があるため、`yy` で始まる変数名は避けるべきです。

#### 字句解析クラスのための初期化コード

`%init{ ... %init}` ディレクティブに書かれた Java コードは字句解析器クラスのコンストラクタにコピーされます。

```
%init{
<code>
%init}
```

`%init{` と `%init}` は行頭に書きます。`<code>` が字句解析器クラスのコンストラクタにコピーされます。

```
class Yylex {
Yylex () {
... <code> ...
}
}
```

このディレクティブを使うことで字句解析器クラスのコンストラクタでの初期化が可能です。`yy` で始まる変数名は生成される字句解析器クラスのために予約されているので避けましょう。

`%init{ ... %init}` に書かれたコードは例外を投げる可能性があります。この例外を宣言するには `%initthrow{ ... $initthrow}` ディレクティブを使います。

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

`%init{ ... %init}` に書かれた Java コードが未宣言の例外を投げる場合、字句解析器のコンパイルに失敗する可能性があります。

#### 字句解析クラスの End-of-File コード

`%eof{ ... %eof}` ディレクティブに書いた Java コードは、字句解析クラスが end-of-file にたどり着いたときの処理に使われます。

```
%eof{
<code>
%eof}
```

`%eof{` と `%eof}` ディレクティブは行頭に書きます。`<code>` に書かれた Java コードは字句解析器が入力ファイルの end-of-file に到達するとすぐ、多くとも一度だけ実行されます。

`%eof{ ... %eof}` に書かれたコードは例外を投げる可能性があります。この例外を宣言するには `%eofthrow{ ... $eofthrow}` ディレクティブを使います。

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

`<code>` の Java コードの一部は `%eof{ ... %eof}` に書かれたコードになります。このコードが `%eofthrow{ ... %eofthrow}` で宣言していない例外を投げる場合、字句解析器のコンパイルに失敗する可能性があります。

#### マクロ定義

マクロ定義は仕様ファイル内の JLex ディレクティブのセクションに埋め込みます。それぞれのマクロ定義は一行で書かれ、マクロ名に続いてイコール(=)、そして定義の順番になります。フォーマットの例は次の通りです。

```
<name> = <definition>
```

改行でない空白文字(例えばスペースやタブ)がイコールの前後に来ても問題ありません。それぞれのマクロ定義は一行で書きます。

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

文字数カウントは 0 からはじまり、マッチした箇所の最初の文字インデックスが `yychar` という整数型の変数に格納されます。

#### 行のカウント

行カウント機能はデフォルトではオフですが、 `%line` ディレクティブを使ってオンにできます。

```
%line
```

行カウントは 0 からはじまり、マッチした箇所の最初の行インデックスが `yyline` という整数型の変数に格納されます。

#### Java CUP 互換性

Java CUP はジョージア工科大学の Scott Hudson に作られた Java の構文解析器生成系です。現在は Frank Flannery, Dan Wang, C. Scott Ananian にメンテナンスや機能拡張されています。詳しくはこちらのサイトを参照してください - [http://www.cs.princeton.edu/~appel/modern/java/CUP/](http://www.cs.princeton.edu/~appel/modern/java/CUP/)

Java CUP 互換機能はデフォルトではオフですが、次の JLex ディレクティブでオンにできます。

```
%cup
```

このディレクティブを使うと字句解析器は `java_cup.runtime.Scanner` インタフェースを実装します。これは次の3つのディレクティブと等価です。

```
%implements java_cup.runtime.Scanner
%function next_token
%type java_cup.runtime.Symbol
```

この3つのディレクティブについては[次のセクション](https://www.cs.princeton.edu/~appel/modern/java/JLex/current/manual.html#SECTION2.2.9)を参照してください。また、CUP のマニュアルにも CUP と JLex を同時に使う方法についての記述があります。

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

これらのディレクティブによる変更がなければ、トークナイズ関数は `Yylex.yylex()` となり、この関数は `Ytoken` 型の値を返します。

スコープ内での名前の衝突を避けるため、 `yy` ではじまる名前は字句解析クラスの関数名や変数名に予約されます。

#### デフォルトのトークン型

32ビットのプリミティブな整数型 `int` をトークナイズ関数の返り値にする (すなわち、トークンクラスを整数型にする) ためには `%integer` ディレクティブを使います。

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

`Yylex.yylex()` の返り値が整数型 `int` なら `null` を返すことができません。代わりに `Yylex.yylex()` は `-1` を返します。この値は`Yylex.YYEOF` と等価です。`%integer` ディレクティブは `%yyeof` を含みます。詳しくは次を参照してください。

#### デフォルトのトークン型 II: ラップクラスの整数

`java.lang.Integer` をトークナイズ関数の返り値にする (すなわち、トークンクラスを `java.lang.Integer` にする) ためには、`%intwrap` ディレクティブを使います。

```
%intwrap
```

次のコード断片の通り、デフォルトでは `Yytoken` がトークナイズ関数 `Yylex.yylex()` の返り値の型です。

```
class Yylex { ...
public Yytoken yylex () {
... }
```

`%intwrap` ディレクティブでこの関数の宣言を変えられます。次のように `java.lang.Integer` が返り値の型になります。

```
class Yylex { ...
public java.lang.Integer yylex () {
... }
```

この宣言により、字句解析アクションがラップクラスの整数型を返すようになります。次のコード断片は仮想的な字句解析アクションです。

```
{ ...
return new java.lang.Integer(0);
... }
```

次のようにして `%intwrap` ディレクティブと等価の内容を `%type` ディレクティブを使っても実現できることに注意しましょう。

```
%type java.lang.Integer
```

これは `Yylex.yylex()` の返り値の型を明示的に `java.lang.Integer` に変更します。

#### End-ofFile におけるYYEOF


`%yyeof` ディレクティブを使うことで `Yylex.YYEOF` という整数型の定数を宣言できます。`%integer` ディレクティブが使われている場合、 `Yylex.YYEOF` は end-of-file が現れたときに返されます。

```
%yyeof
```

このディレクティブを使うと `Yylex.YYEOF` は次のように宣言されます。

```
public final int YYEOF = -1;
```

`%integer` ディレクティブは `%yyeof` を含みます。

#### 改行と OS 互換性

UNIX では改行文字は `\n` で表現します。DOS では、改行文字の前に復帰文字をつけて `\r\n` という二文字で改行を表現します。`%notunix` ディレクティブを使と復帰文字か改行文字が改行として扱われます。

```
%notunix
```

正しく改行シーケンスを認識することは Java のプラットフォーム独立性のために重要です。

#### 文字セット

デフォルトでサポートされているアルファベットの文字コード値は 0 以上かつ 127 以下です。生成された字句解析器がこの範囲外の文字を扱うと字句解析に失敗する可能性があります。

`%full` ディレクティブを使うとサポートするアルファベットの文字コードレンジを 8 ビット長に拡張できます。

```
%full
```

`%full` ディレクティブが与えられると、JLex は 0 以上かつ 255 以下の文字コード値をサポートする字句解析器を生成します。

`%unicode` を使うと 16 ビット長の unicode 文字を扱えます。

```
%unicode
```

`%unicode` ディレクティブが与えられると、JLex は 0 以上かつ 2^16-1 以下の文字コード値をサポートする字句解析器を生成します。

`%ignorecase` ディレクティブが与えられると、生成された字句解析器は大文字小文字を無視します。

```
%ignorecase
```

`%ignorecase` ディレクティブが与えられると、CUP は大文字小文字とタイトルケースにマッチする unicode フレンドリーな文字クラスを生成します。

#### ファイル入出力に関する文字コード

現在のバージョンの JLex は字句解析器の仕様を Ascii のテキストファイルで書く必要があり、入出力ファイルも Ascii のテキストファイルです。しかしながら、将来の拡張のため JLex の内部では 16 bit の Java 文字型で処理されています。

#### 字句解析にともなう例外処理

JLex 正規表現のアクション部に書かれたコードは例外を投げる可能性があります。この例外を宣言するには `%yylexthrow{ ... %yylexthrow}` ディレクティブを使います。

```
%yylexthrow{
<exception[1]>[, <exception[2]>, ...]
%yylexthrow}
```

ここに書かれた Java コードはトークナイズ関数 `Yylex.yylex()` の宣言部にコピーされます。次の例を参照してください。

```
public Yytoken yylex ()
throws <exception[1]>[, <exception[2]>, ...]
{
...
}
```

正規表現のアクション部に書かれたコードが `{%yylexthrow{ ... %yylexthrow}` で宣言されていない例外を投げる場合、生成された字句解析のコンパイルに失敗する可能性があります。

#### End-of-File に対する返り値

`%eofval{ ... %eofval}` ディレクティブで end-of-file に対する返り値を指定できます。このディレクティブの中に Java コードを書くと字句解析器のトークナイズ関数 `Yylex.yylex()` にコピーされ、字句解析器が end-of-file を処理するときに実行されます。このコードの返り値の型は `Yylex.yylex()` の返り値の型と同じである必要があります。

```
%eofval{
<code>
%eofval}
```

`<code>` の中の Java コードは、字句解析器クラスが入力ファイルを解析し end-of-file に辿り着いたときに `Yylex.yylex()` が返す値を決定します。これは `Yylex.yylex()` が end-of-file に辿り着くたびに実行されるので、`<code>` は複数回実行される可能性があります。また、`%eofval{` と `%eofval}` は行頭に書くべきです。

使用例は次の通りです。end-of-file に対する返り値はデフォルトの `null` ではなく `(new token(sym.EOF))` と仮定します。その場合は次のような宣言を行います。

```
%eofval{
return (new token(sym.EOF));
%eofval}
```

このコードは `Yylex.yylex()` の適切な場所にコピーされます。

```
public Yytoken yylex () { ...
return (new token(sym.EOF));
... }
```

これで end-of-file に対する `Yylex.yylex()` の返り値は `(new token(sym.EOF))` になります。

#### 実装するインタフェースの指定

JLex では次の宣言を入力ファイルに入れることで、 `Yylex` クラスが実装するインタフェースを指定できます。

```
%implements <classname>
```

これは yylex が `classname` を実装することを宣言します。生成されるパーサークラス定義は次のようになります。

```
class Yylex implements classname { ...
```

#### 生成されるクラスを public に変更

`%public` ディレクティブで JLex が生成する字句解析クラスを public にできます。

```
%public
```

デフォルトでは生成されるクラスにはアクセス修飾子が付与されないので、現在のパッケージからのみ参照可能になります。


## 正規表現ルール

JLex 仕様の三番目の部分は一連の正規表現から成ります。正規表現は入力ストリームからトークンを分割するために使われます。このルール群は正規表現と、マッチした時に動作する Java コードの組み合わせです。

ルール群は三つの部分から成ります。オプションの状態リスト、正規表現、関連するアクションです。フォーマットは次の通りです。

```
[<states>] <expression> { <action> }
```

各々の部分については後で詳しく解説します。

入力が複数の正規表現にマッチする場合、生成される字句解析器は最も長くマッチする正規表現を採用します。複数の正規表現にマッチし、かつどちらを選んでもマッチする長さが変わらない場合、先に書かれた正規表現が優先されます。

JLex 仕様の正規表現ルール部は全ての可能な全ての入力にマッチするべきです。生成された字句解析器がマッチしない入力を受け取るとエラーになります。

次の行を JLex 仕様の最後に置くことで、全ての入力にマッチすることを保証できます。

```
. { java.lang.System.out.println("Unmatched input: " + yytext()); }
```

ドット (.) は改行を除く全ての入力にマッチします。

### 状態

オプションの状態リストは正規表現より先に来ます。次のような形式です。

```
<state[0][, state[1], state[2], ...]>
```

外側のブラケット ([]) は複数の状態がオプショナルであることを意味しています。小なり記号 (<) と大なり記号 (>) は状態リストそのものを表現します。状態リストはどの状態のときに、続く正規表現をマッチさせるのかを指定します。

`yylex()` が状態 A のときに呼ばれるとすると、字句解析器は状態リストに A を含む正規表現のみと入力をマッチさせようとします。

状態リストが与えられないとき、正規表現は状態を問わずマッチします。

### 正規表現

正規表現は空白を含むべきではありません。空白は正規表現の終端だと解釈されるからです。ただし、例外が一つあります。改行ではない空白文字がダブルクオーテーションの中で現れると、それは空白として解釈されます。例えば `" "` は空白文字として扱われます。

JLex のアルファベットは Ascii の文字セットです。すなわち、文字コード値は 0 以上かつ 127 以下です。

次の文字は JLex 正規表現において特別な意味を持つメタ文字です。

```
? * + | ( ) ^ $ . [ ] { } " \
```

その他の文字はその文字自身を表します。

* `ef` 複数の正規表現を続けて書くことは正規表現の結合を意味します。
* `e|f` 縦棒は正規表現の選択肢を表現します。この例では `e` か `f` かどちらかのマッチを意味します。

次のエスケープシーケンスは特別な意味を持ちます。

* \b	バックスペース
* \n	改行
* \t	タブ
* \f	フォームフィード
* \r	キャリッジリターン
* \ddd	各桁を d で表現したときの8進数の文字コード
* \xdd	各桁を d で表現したときの16進数の文字コード
* \udddd	各桁を d で表現した時の16進数のユニコード文字
* \^C	コントロール文字
* \c	バックスラッシュと、その他の文字 c が続くもの
* $	ドル記号 ($) は行末を意味します。ドル記号で正規表現が終わる場合、その正規表現は行末でのみマッチします。
* .	ドット記号 (.) は改行を除く全ての文字にマッチします。これは `[^\n]` と等価です。
* "..." メタ文字はダブルクオーテーションの中では特殊な意味を持ちません。`\"` (これは `"` 一文字を表現します) だけが例外です。
* 波括弧はマクロ展開を意味します。波括弧の中はマクロの名前です。
* アスタリスク (*) はクリーネ閉包を意味し、直前の正規表現の 0 回以上の繰り返しを意味します。
* プラス (+) は直前の正規表現の 1 回以上の繰り返しを意味します。つまり `e+` は `ee*` と等価です。
* クエスチョンマーク (?) は直前の正規表現の 0 回か 1 回かのマッチを意味します。
* 括弧は正規表現のグルーピングのために使われます。

* 角括弧 [...] は文字クラスを表現し、角括弧内のいずれの文字ともマッチします。開き角括弧 ([) の最初の文字が上矢印 (^) の場合、角括弧に含まれない文字とマッチする、否定の文字クラスになります。角括弧の中ではいくつかのメタ文字の意味が次のように変わります。
    * {name}	マクロ展開
	* a - b	文字セットにおける `a` から `b` までの文字コードの範囲
    * "..."	メタ文字はダブルクオーテーションの中では特殊な意味を持ちません。`\"` (これは `"` 一文字を表現します) だけが例外です。
    * \	バックスラッシュに続けて書いたメタ文字は特殊な意味を持ちません。

例えば [a-z] は任意の小文字のアルファベットにマッチし、[^0-9] は数字以外にマッチします。また [0-9a-fA-F] は任意の16進数にマッチします。文字クラス角括弧の中では、バックスラッシュに続くメタ文字は特殊な意味を持ちません。したがって、[\-\\] はダッシュかバックスラッシュにマッチします。同様に ["A-Z"] は A かダッシュか Z のいずれかとマッチします。文字クラスの中で先端か末尾に来るダッシュも特殊な意味を失います。なので  [+-] や [-+] は予想通りに振る舞うでしょう (つまり、'+' と '-' にのみマッチします)。

### アクション

正規表現に紐付いた Java コードは波括弧に囲まれます。

```
{ action }
```

与えられた Java コードは JLex によって字句解析器にコピーされます。

アクションの中にある波括弧で文字列でもコメントでもないものは、開き括弧と綴じ括弧の数が同じであるべきです。

#### アクションと再帰

If no return value is returned in an action, the lexical analyzer will loop, searching for the next match from the input stream and returning the value associated with that match.

アクションに返り値がない場合、字句解析器はループし (ToDo)、次にマッチするものを入力ストリームから探して対応する値を返します。

字句解析器は `yylex()` をコールすることで明示的に再帰できます。次のコード断片を参照してください。

```
{ ...
return yylex();
... }
```

このコード断片は再帰的に字句解析し、次のマッチを探して対応する値を返します。同じことは単にアクションで値を返さないことでも実現できます。そうすることでオーバーヘッドなく次のマッチを探すことができます。

前述のコード断片は末尾再帰の例です。なぜなら再帰呼び出しが処理の最後に来ているからです。次のコード断片は末尾再帰でない再帰呼び出しの例です。

```
{ ...
next = yylex();
... }
```

`yyline` や `yychar` が再帰処理の途中で変更される場合を除き、末尾再帰でない再帰呼び出しは好ましくありません。

#### 状態遷移

字句解析の状態は JLex ディレクティブのセクションで宣言され、状態遷移は正規表現のアクション部で宣言されます。状態遷移は次の関数呼び出しで行われます。

```
yybegin(state);
```

`yybegin()` は状態名 `state` を受け取り、その値にもとづいて字句解析器の状態を遷移させる。

状態 `state` は JLex ディレクティブのセクションで宣言されなければなりません。宣言されない場合は生成後のファイルはコンパイルに失敗します。状態宣言における唯一の例外は `YYINITIAL` です。これは JLex では暗黙的に宣言されます。生成される字句解析器の初期状態 `YYINITIAL` で、最初の状態遷移が起こるまでその状態が続きます。

#### 使用可能な字句解析器の値

次の値は `Yylex` クラスで定義されており、正規表現ルールのアクション部で使用可能です。

| 変数とメソッド | ActivationDirective | 説明 |
| java.lang.String yytext(); | Always active. | 入力ストリームでマッチした箇所の文字列。 |
| int yychar; | %char | 入力ストリームでマッチした箇所の最初の文字のインデックス |
| int yyline; | %line | 入力ストリームでマッチした箇所の行番号 |

## 字句解析器の生成

JLex は正しい書式の仕様を受け取り、それに対応する Java の字句解析器ファイルを生成します。

Yylex クラスに字句解析器は定義されます。このクラスには二つのコンストラクタがあり、どちらも一つの引数を必要とします: トークナイズされる入力ストリームです。入力ストリームは `java.io.InputStream` か `java.io.Reader` (`StringReader` など) です。`java.io.Reader` コンストラクタは、字句解析器でユニコード文字を扱いたいときに使うことに注意しましょう。JDK 1.0 では `java.io.InputStream` クラスはユニコード文字を正しく読み込めません。

字句解析器にアクセスするための関数は `Yylex.yylex()` で、この関数は入力ストリームから次のトークンを返します。返り値の型は `Yytoken` となります。この関数は次のように定義されています。

```
class Yylex { ...
public Yytoken yylex () {
... }
```

(ToDo) ユーザは `Yytoken` の型を JLex 仕様の最初のユーザーコードのセクションで指定できます。例えば `Yylex.yylex()` に整数値のラッパーを返させる場合、最初の `%%` の前に次のコードを書きます。

```
class Yytoken { int field; Yytoken(int f) { field=f; } }
```

こうすると、正規表現アクションでは整数値のラッパーが返されます。次のようにです。

```
{ ...
return new Yytoken(0);
... }
```

同様に、ユーザーコードのセクションで各々のトークンに対応する整数値を格納するクラスを定義できます。

```
class TokenCodes { ...
public static final STRING = 0;
public static final INTEGER = 1;
... }
```

字句解析アクションで、このトークンコードを返します。

```
{ ...
return new Yytoken(STRING);
... }
```

これらは単純化された例です。現実的には単なる整数のコード値より多くの情報を持つトークンクラスを定義することになるでしょう。

(ToDo) これらの例は `Yylex.yylex()` が任意の複雑なトークン型を定義することを許すオブジェクト指向のテクニックをユーザーに提示します。特に継承により、ユーザにひとつ以上のトークン型を返す選択肢を与えます。異なるトークン型が整数や文字列に対して必要な場合、ユーザは次のような宣言をすることができます。

```
class Yytoken { ... }
class IntegerToken extends Yytoken { ... }
class StringToken extends Yytoken { ... }
```

こうすることでユーザは `IntegerToken` と `StringToken` を字句解析アクションから返すことができます。

字句解析器クラス、トークナイズ関数、そして返り値の型の名前は JLex ディレクティブで変更できます。詳しくは[セクション 2.2.9](https://www.cs.princeton.edu/~appel/modern/java/JLex/current/manual.html#SECTION2.2.9)を参照してください。

## パフォーマンス

試験的にベンチマーク機能が導入されました。これは JLex が生成した字句解析器と手書きの字句解析器のパフォーマンスを比較するものです。比較は単純な `toy` プログラミング言語に対して行われます。手書きの字句解析器は JLex が生成する字句解析器と同様に Java で書かれています。

このベンチマークは字句解析の実行を `toy` プログラミング言語で書かれた2つのソースファイルに対して行い、それを処理するのに要した時間を計測することで行います。字句解析の起動は Java で書かれたダミーのドライバを通して行います。

生成される字句解析器は、次のベンチマークが示すようにとても速くなります。

| ソースコードの大きさ | JLex が生成した字句解析器: 実行時間 | 手書きの字句解析器: 実行時間 |
| 177 行 | 0.42 秒 | 0.53 秒 |
| 897 行 | 0.98 秒 | 1.28 秒 |

JLex の生成した字句解析器が完全に手書きの字句解析器より速く動作しました。

JLex のような機械的に生成される字句解析器に対する批判の一つに、手書きの字句解析器よりもパフォーマンスが悪いというものがあります。したがって、この JLex による字句解析器のパフォーマンスの高さは注目すべき点です。

## 実装に関する問題

### 未実装の機能

次のリストは (おそらく不完全な) JLex の未実装機能です。

1. (ToDo) 正規表現の先読みオペレータが未実装で、正規表現のメタ文字リストに含まれていません。
2. 行頭オペレータ (^) が次の標準的でない振る舞いをします。このオペレータを使う正規表現はマッチするより前の改行文字を破棄します。

### ユニコード対アスキー

Ansi C の `char` 型における8ビットの文字とは異なり、Java では16ビットの `char` 型とユニコード文字セットを扱えます。Java 組み込みの `String` クラスはこの湯にコード文字を操作できます。

バージョン 1.2.5 までの JLex は JDK 1.1 の `Reader` と `Writer` クラスをそれぞれ JLex 仕様ファイルの読み込みと字句解析ソースファイルの出力に使用しています。つまり全てのユニコード文字がこれらのファイルで使用できるということです。生成された字句解析器がユニコード文字を扱うには、生成された字句解析器の `java.io.Reader` コンストラクタを使います。こうすることで `Reader` はOSネイティブのフォーマットからユニコードへの変換を行います。また `%unicode` ディレクティブを仕様で指定する必要があります。詳しくは[セクション2.2.14](https://www.cs.princeton.edu/~appel/modern/java/JLex/current/manual.html#SECTION2.2.14)を参照してください。

### 状態リストの中のコンマ

(ToDo) 状態名リストや正規表現ルール宣言の中にあるコンマはオプションです。これらのリストはコンマをセパレータとせずとも状態名の区切りに空白を使うことでも正しくパースできます。

### 未実装の機能に対するウィッシュリスト

次の項目は JLex にあるべき機能ですが、パフォーマンスに与える影響などの問題により未実装なものです。

1. 字句解析アクションのコメント部分における波括弧がマッチしていない状態の検知
2. マクロ定義の循環定義の検知

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
