import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import mongodb from "../../../../lib/mongodb";
import Resultados, { IResultados } from "../../../../models/results";
import Prueba, { ISeccion, IPrueba } from "../../../../models/testing";
import User from "../../../../models/user";
import mongoose from "mongoose";
import {
  formatResultsForExcelTypeOne,
  formatResultsForExcelTypeTwo,
  createExcel,
} from "./TestExport";

export async function GET(
  request: Request,
  { params }: { params: { idTest: string } }
) {
  const idTest: string = params?.idTest as string;

  //Verifica que el id sea valido
  if (idTest === "" || !mongoose.Types.ObjectId.isValid(idTest)) {
    return NextResponse.json({
      success: false,
      error: "Not Found",
      message: "El id de prueba no es valido",
    });
  }

  // Connect to MongoDB
  await mongodb();

  //Recupera el documento de la prueba
  const PruebaDocument: IPrueba = await (
    Prueba as mongoose.Model<IPrueba>
  ).findById(idTest);

  //Verifica que el documento de la prueba exista y sea valido
  if (!PruebaDocument) {
    return NextResponse.json({
      success: false,
      error: "Not Found",
      message: "La prueba con ese id no existe",
    });
  }

  //Recupera todos los resultados de esa prueba
  const ResultadosArrayDocument: IResultados[] = await (
    Resultados as mongoose.Model<IResultados>
  )
    .find({
      id_prueba: idTest,
    })
    .populate({
      path: "id_user",
      model: User,
      select:
        "firstName lastName email role creationDate phone currentSchool educationLevel generation grade group",
    });

  //Verificar si existen resultados
  if (ResultadosArrayDocument?.length === 0) {
    return NextResponse.json({
      success: false,
      error: "Not Found",
      message: "No hay resultados",
    });
  }

  //Define el tipo de test
  const testType: number = PruebaDocument?.tipo;

  //*Debug
  // return NextResponse.json({
  //   success: true,
  //   data: {
  //     testType,
  //     data: { ResultadosArrayDocument, PruebaDocument },
  //   },
  //   message: "No hay resultados",
  // });

  try {
    if (testType === 1) {
      const { headers, data } = formatResultsForExcelTypeOne(
        PruebaDocument,
        ResultadosArrayDocument
      );
      // console.log(headers);
      // console.log(data);
      const excelBuffer = createExcel(headers, data);

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename=Resultados_Tests_${PruebaDocument?.titulo}.xlsx`,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    } else if (testType === 2) {
      const { headers, data } = formatResultsForExcelTypeTwo(
        PruebaDocument,
        ResultadosArrayDocument
      );
      // console.log(headers);
      // console.log(data);
      const excelBuffer = createExcel(headers, data);

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename=Resultados_Tests_${PruebaDocument?.titulo}.xlsx`,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Not Found type",
        message: "Error en la creacion del excel.",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: error,
      message: "Error en la creacion del excel.",
    });
  }

  return NextResponse.json({
    message: "Hello World",
  });
}
