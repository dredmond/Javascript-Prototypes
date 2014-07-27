using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace HexViewer
{
    public class BackupParser
    {
        private readonly byte[] _data;

        public int Offset { get; private set; }

        public int Length
        {
            get { return _data.Length; }
        }

        public BackupParser(string file)
        {
            if (!File.Exists(file))
                throw new FileNotFoundException(file);

            _data = File.ReadAllBytes(file);
        }

        private bool IsValidRequest(int size)
        {
            return Offset + size < Length;
        }

        public int ReadInt()
        {
            if (!IsValidRequest(4))
                throw new BytesNotAvailableException("ReadInt", 4);

            Offset += 4;
        }

        public byte[] ReadBytes(int size)
        {
            if (!IsValidRequest(size))
                throw new BytesNotAvailableException("ReadBytes", size);

            
        }

        public string ReadString()
        {
            var stringSize = -1;

            try
            {
                stringSize = ReadInt();
            }
            catch (Exception ex)
            {
                throw new BytesNotAvailableException("ReadString", stringSize, ex);
            }

            return ReadString(stringSize);
        }

        private string ReadString(int size)
        {
            if (size <= 0)
                return "";

            if (!IsValidRequest(size))
                throw new BytesNotAvailableException("ReadString", size);


        }

        public FileType ReadFileType()
        {
            
        }
    }
}
