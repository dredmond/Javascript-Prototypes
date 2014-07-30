using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace HexViewer
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();

            TestParse();
        }

        private void TestParse()
        {
            textBox2.Clear();
            const string filePath = @"C:\Users\Donny\AppData\Roaming\Apple Computer\MobileSync\Backup\180afbd8d349c5d29da1030a646fbc3296877be0\Manifest.mbdb";
            //const string filePath = @"C:\Users\Donny\AppData\Roaming\Apple Computer\MobileSync\Backup\7c97e37cefca9d87de0c19da5a791bc7ae78c8ff\Manifest.mbdb";
            var parser = new BackupParser(filePath);
            var header = "";
            var domain = "";
            var path = "";
            var hash = "";
            var notSure = "";
            var propertyLen = 0;
            byte[] otherData, otherData1;

            header = parser.ReadString(4);
            textBox2.AppendText(string.Format("Header: {0}, Location: {1}, Size: {2}\r\n", header, parser.Offset, parser.Length));

            var headerBytes = parser.ReadBytes(2);
            textBox2.AppendText(string.Format("{0:x2} {1:x2}\r\n", headerBytes[0], headerBytes[1]));
            
            while (!parser.HasReachedEof())
            {
                try
                {
                    domain = parser.ReadString().Replace("\0", "");
                    path = parser.ReadString().Replace("\0", "");

                    notSure = parser.ReadString().Replace("\0", "");

                    hash = parser.ReadString().Replace("\0", "");
                    textBox2.AppendText(string.Format("{0} {1} {2} {3}\r\n", domain, path, notSure, hash));

                    otherData = parser.ReadBytes(41);

                    propertyLen = parser.ReadInt8();
                    textBox2.AppendText(string.Format("Properties: {0}\r\n", propertyLen));

                    if (propertyLen == 0)
                        continue;

                    for (var i = 0; i < propertyLen; i++)
                    {
                        var property = parser.ReadString();
                        property = property.Replace("\0", "");

                        var propertyPart2 = parser.ReadString();
                        propertyPart2 = propertyPart2.Replace("\0", "");

                        textBox2.AppendText(string.Format("Property {0}: {1} {2}\r\n", i, property, propertyPart2));
                    }
                }
                catch (Exception)
                {
                }
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            treeView1.Nodes.Clear();

            var rootNode = new TreeNode(textBox1.Text);
            treeView1.Nodes.Add(rootNode);

            Directory.SetCurrentDirectory(textBox1.Text);

            var files = Directory.GetFiles(textBox1.Text, "*", SearchOption.AllDirectories);

            foreach (var file in files)
            {
                rootNode.Nodes.Add(file.Replace(textBox1.Text, ""));
            }
            treeView1.Refresh();
        }

        

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            textBox2.Clear();
            textBox2.AppendText("File: " + e.Node.Text + "\r\n\r\n");

            if (!File.Exists(e.Node.Text))
                return;

            var data = File.ReadAllBytes(e.Node.Text);
            textBox2.AppendText(HexToString(8, 4, data));
            textBox2.SuspendLayout();
            
            textBox2.Select(0, 0);
            textBox2.ScrollToCaret();
            textBox2.ResumeLayout(true);
        }

        private static string HexToString(int size, int width, byte[] data)
        {
            var result = new StringBuilder();

            for (var i = 0; i < data.Length; i += size * width)
            {
                result.AppendLine(WriteHexLine(i, size, width, data) + "     " + WriteAsciiLine(i, size, width, data));
            }

            return result.ToString();
        }

        private static string WriteHexLine(int offset, int size, int width, byte[] data)
        {
            var result = new StringBuilder();
            var bytesWritten = 0;

            for (var i = offset; i < data.Length && bytesWritten < size * width; i++, bytesWritten++)
            {
                if (bytesWritten % size == 0)
                {
                    result.Append(" ");
                }

                result.Append(String.Format("{0:x2}", data[i]));
            }

            while (bytesWritten < size * width)
            {
                if (bytesWritten % size == 0)
                {
                    result.Append(" ");
                }

                result.Append("  ");
                bytesWritten++;
            }

            return result.ToString();
        }

        private static string WriteAsciiLine(int offset, int size, int width, byte[] data)
        {
            var result = new StringBuilder();
            var bytesWritten = 0;

            for (var i = offset; i < data.Length && bytesWritten < size * width; i++, bytesWritten++)
            {
                if (bytesWritten % size == 0)
                {
                    result.Append(" ");
                }

                if (data[i] > 31 && data[i] < 128)
                    result.Append(Convert.ToChar(data[i]));
                else
                    result.Append(".");
            }

            return result.ToString();
        }
    }
}
